import * as vscode from "vscode";
import type { StateHandler } from "./state.handle";

export async function handleTokenExpiration(context: vscode.ExtensionContext, state: StateHandler) {
	await context.secrets.delete("osmynt.token");
	await context.secrets.delete("osmynt.privateKey");
	vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", false);
	state.updateState({
		isInitialized: false,
		isConnecting: false,
	});
	vscode.window.showInformationMessage("Session expired. Please login again.");
	await vscode.commands.executeCommand("osmynt.login");
}
