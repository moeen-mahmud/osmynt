import * as vscode from "vscode";
import WebSocket from "ws";
import type { OsmyntDataProvider, UserInfo } from "../provider/osmynt-data.provider";
import { initializeWebSocket } from "../services/websocket.service";
import { MAX_RECONNECT_ATTEMPTS, RECONNECT_DELAY, WEBSOCKET_INIT_TIMEOUT } from "../constants/constants";
import { setupUserAndConnections } from "./user.handle";
import type { StateHandler } from "./state.handle";
import { setupUserTeams } from "./user-teams.handle";

function createWebSocketPromise(
	context: vscode.ExtensionContext,
	user: UserInfo,
	osmyntProvider: OsmyntDataProvider,
	state: StateHandler,
	statusBar: vscode.StatusBarItem
): Promise<WebSocket | null> {
	// biome-ignore lint/suspicious/noAsyncPromiseExecutor: using promise executor to handle async initialization for now
	return new Promise(async resolve => {
		const timeoutId = setTimeout(() => {
			console.error("WebSocket initialization timeout");
			resolve(null);
		}, WEBSOCKET_INIT_TIMEOUT);

		try {
			const websocket = await initializeWebSocket(context, user, osmyntProvider, state, statusBar);
			clearTimeout(timeoutId);

			if (!websocket) {
				throw new Error("WebSocket initialization failed");
			}

			websocket.on("open", () => {
				state.updateState({
					isConnecting: false,
					isInitialized: true,
					reconnectAttempts: 0,
				});
				// vscode.commands.executeCommand("setContext", "osmynt.isRealtime", true);
				resolve(websocket);
			});

			websocket.on("error", async error => {
				console.error("WebSocket error:", error);
				await handleWebSocketError(context, user, osmyntProvider, state, statusBar);
			});

			websocket.on("close", async () => {
				cleanupWebSocketState(state);
				// vscode.commands.executeCommand("setContext", "osmynt.isRealtime", false);
			});
		} catch (error) {
			clearTimeout(timeoutId);
			console.error("Error in WebSocket setup:", error);
			resolve(null);
		}
	});
}

export async function setupWebSocketConnection(
	context: vscode.ExtensionContext,
	user: UserInfo,
	osmyntProvider: OsmyntDataProvider,
	state: StateHandler,
	statusBar: vscode.StatusBarItem
): Promise<WebSocket | null> {
	if (state.getState().isConnecting) {
		console.log("WebSocket connection already in progress");
		return null;
	}

	// Reset state before attempting new connection
	const socket = state.getState().socket;
	if (socket) {
		socket.removeAllListeners();
		socket.close();
		state.updateState({
			socket: undefined,
		});
	}

	state.updateState({
		isConnecting: true,
	});
	// vscode.commands.executeCommand("setContext", "osmynt.isRealtime", false);

	// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation above>
	return new Promise(async resolve => {
		const timeoutId = setTimeout(() => {
			state.updateState({
				isConnecting: false,
			});
			console.error("WebSocket initialization timeout");
			vscode.window.showErrorMessage("Connection timeout. Please try again.");
			resolve(null);
		}, WEBSOCKET_INIT_TIMEOUT);

		try {
			const websocket = await initializeWebSocket(context, user, osmyntProvider, state, statusBar);
			clearTimeout(timeoutId);

			if (!websocket) {
				throw new Error("WebSocket initialization failed");
			}

			websocket.on("open", () => {
				state.updateState({
					isConnecting: false,
					isInitialized: true,
					isLoggedIn: true,
					reconnectAttempts: 0,
				});
				// vscode.commands.executeCommand("setContext", "osmynt.isRealtime", true);
				vscode.window.showInformationMessage("Successfully connected to Osmynt");
				resolve(websocket);
			});

			websocket.on("error", async error => {
				console.error("WebSocket error:", error);
				await handleWebSocketError(context, user, osmyntProvider, state, statusBar);
			});

			websocket.on("close", async () => {
				cleanupWebSocketState(state);
			});

			return websocket;
		} catch (error) {
			clearTimeout(timeoutId);
			cleanupWebSocketState(state);
			console.error("Error in WebSocket setup:", error);
			vscode.window.showErrorMessage("Failed to establish connection");
			resolve(null);
		}
	});
}

export function cleanupWebSocketState(state: StateHandler) {
	state.updateState({
		isInitialized: false,
		isConnecting: false,
		reconnectAttempts: 0,
	});
	// vscode.commands.executeCommand("setContext", "osmynt.isRealtime", false);
}

async function handleWebSocketError(
	context: vscode.ExtensionContext,
	user: UserInfo,
	osmyntProvider: OsmyntDataProvider,
	state: StateHandler,
	statusBar: vscode.StatusBarItem
) {
	if (state.getState().reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
		state.updateState({
			reconnectAttempts: state.getState().reconnectAttempts + 1,
		});
		vscode.window.showInformationMessage(
			`Attempting to reconnect... (${state.getState().reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
		);

		setTimeout(async () => {
			const socket = await setupWebSocketConnection(context, user, osmyntProvider, state, statusBar);

			state.updateState({
				socket: socket as WebSocket,
			});
		}, RECONNECT_DELAY);
	} else {
		cleanupWebSocketState(state);
		vscode.window.showErrorMessage("Failed to maintain connection. Please try reconnecting manually.");
	}
}

export const registerWebSocketCommands = (
	context: vscode.ExtensionContext,
	state: StateHandler,
	osmyntProvider: OsmyntDataProvider,
	statusBar: vscode.StatusBarItem
) => {
	const socket = state.getState().socket;
	return context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.disconnect", async () => {
			if (socket?.readyState !== WebSocket.OPEN) {
				vscode.window.showInformationMessage("No active connection to disconnect");
			}

			try {
				socket?.removeAllListeners();
				socket?.close();
				state.updateState({
					socket: undefined,
				});
				cleanupWebSocketState(state);
				vscode.window.showInformationMessage("Disconnected from Osmynt");
			} catch (error) {
				console.error("Error disconnecting:", error);
				vscode.window.showErrorMessage("Failed to disconnect properly");
			}
		}),

		vscode.commands.registerCommand("osmynt.connect", async () => {
			if (socket?.readyState === WebSocket.OPEN) {
				vscode.window.showInformationMessage("Already connected to Osmynt");
			}

			try {
				const token = await context.secrets.get("osmynt.token");
				const privateKey = await context.secrets.get("osmynt.privateKey");
				if (!token || !privateKey) return;

				const userInfo = await setupUserAndConnections(token, osmyntProvider);
				await setupUserTeams(token, osmyntProvider);
				if (!userInfo) return;

				state.updateState({
					socket: (await createWebSocketPromise(
						context,
						userInfo,
						osmyntProvider,
						state,
						statusBar
					)) as WebSocket,
				});
			} catch (error) {
				console.error("Error connecting:", error);
				vscode.window.showErrorMessage("Failed to establish connection");
			}
		})
	);
};
