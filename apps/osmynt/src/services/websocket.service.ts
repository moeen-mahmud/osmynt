import * as vscode from "vscode";
import WebSocket from "ws";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { config } from "api";
import type { StateHandler } from "../handlers/state.handle";
import { updateLoginStatusBar } from "../statusbar/login.statusbar";
import { decode, UserKeyPair } from "library";

export const initializeWebSocket = async (
	context: vscode.ExtensionContext,
	user: Record<string, unknown>,
	dataProvider: OsmyntDataProvider,
	state: StateHandler,
	statusBar: vscode.StatusBarItem
) => {
	if (!user) {
		return;
	}

	const token = await context.secrets.get("osmynt.token");
	const privateKey = await context.secrets.get("osmynt.privateKey");
	const socket = new WebSocket(`${config.endpoint}/api/socket?token=${token}`);

	if (!token || !privateKey) {
		vscode.window.showErrorMessage("Authentication credentials not found. Please log in again.");
		return;
	}

	socket.onopen = async () => {
		state.updateState({
			isConnecting: false,
			isInitialized: true,
			reconnectAttempts: 0,
			socket,
		});

		vscode.commands.executeCommand("osmynt.login");

		// vscode.window.showInformationMessage("Starting real-time updates");
	};

	socket.onmessage = async event => {
		try {
			const data = JSON.parse(event.data as any);

			if (data.code) {
				const privateKey = await context.secrets.get("osmynt.privateKey");
				if (!privateKey) {
					throw new Error("Private key not found");
				}

				// Parse the encrypted code string since it's double stringified

				// Decrypt the code
				const decryptedCode = await UserKeyPair.decrypt(data.code, privateKey);

				// Add to data provider
				dataProvider.addReceivedCode({
					...data,
					code: decode(decryptedCode),
				});
			}
		} catch (error) {
			console.error("Failed to process received code:", error);
			vscode.window.showErrorMessage("Failed to process received code");
		}
	};

	socket.onclose = async () => {
		vscode.window.showInformationMessage("Real-time updates stopped");
		updateLoginStatusBar(statusBar, true);

		state.updateState({
			isConnecting: false,
			isInitialized: false,
			reconnectAttempts: 0,
			socket,
		});
	};

	socket.onerror = async () => {
		vscode.window.showErrorMessage("An error occurred while receiving real-time updates");
		state.updateState({
			isConnecting: false,
			isInitialized: false,
			reconnectAttempts: 0,
			socket,
		});
	};

	return socket;
};
