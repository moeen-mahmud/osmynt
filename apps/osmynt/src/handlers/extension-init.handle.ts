import * as vscode from "vscode";
import type WebSocket from "ws";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { validateAndRefreshToken } from "./token-validation.handle";
import { setupUserAndConnections } from "./user.handle";
import {
	cleanupWebSocketState,
	registerWebSocketCommands,
	setupWebSocketConnection,
} from "./websocket-connection.handle";
import type { StateHandler } from "./state.handle";
import { setupUserTeams } from "./user-teams.handle";
import { updateLoginStatusBar } from "../statusbar/login.statusbar";

export async function initializeExtension(
	context: vscode.ExtensionContext,
	osmyntProvider: OsmyntDataProvider,
	inlineCompletionProvider: any,
	treeView: vscode.TreeView<any>,
	state: StateHandler,
	loginStatusBarItem: vscode.StatusBarItem
): Promise<void> {
	try {
		const token = await validateAndRefreshToken(context, state);
		if (!token) return;

		const user = await setupUserAndConnections(token, osmyntProvider);
		if (!user) return;

		await setupUserTeams(token, osmyntProvider);

		// Setup completion provider before WebSocket initialization
		const originalAddReceivedCode = osmyntProvider.addReceivedCode.bind(osmyntProvider);
		osmyntProvider.addReceivedCode = snippet => {
			originalAddReceivedCode(snippet);
			inlineCompletionProvider.updateSnippets(osmyntProvider.getAllSnippets());
		};

		const socket = await setupWebSocketConnection(context, user, osmyntProvider, state, loginStatusBarItem);
		state.updateState({
			socket: socket as WebSocket,
		});

		// Register WebSocket commands
		registerWebSocketCommands(context, state, osmyntProvider, loginStatusBarItem);
	} catch (error) {
		console.error("Error initializing extension:", error);
		cleanupWebSocketState(state);
		updateLoginStatusBar(loginStatusBarItem, false);
		vscode.window.showErrorMessage("Failed to initialize Osmynt extension");
	}
}
