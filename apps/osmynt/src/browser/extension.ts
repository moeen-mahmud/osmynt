import * as vscode from "vscode";
import { OsmyntBrowserApp } from "@/browser/app";
import { BrowserCrypto } from "@/browser/crypto";
import { BrowserStorage } from "@/browser/storage";
import { BrowserUI } from "@/browser/ui";

// VS Code Web Extension entry point
export function activate(context: vscode.ExtensionContext) {
	console.log("Osmynt Web Extension is now active!");

	// Initialize browser-specific components
	const storage = new BrowserStorage();
	const crypto = new BrowserCrypto();
	const ui = new BrowserUI();
	const app = new OsmyntBrowserApp(storage, crypto, ui);

	// Initialize the app
	app.initialize().then(() => {
		console.log("Osmynt Web Extension initialized successfully");
	});

	// Register commands for VS Code web extension
	const commands = [
		vscode.commands.registerCommand("osmynt.login", async () => {
			try {
				console.log("Osmynt: Login command triggered");
				vscode.window.showInformationMessage("Osmynt: Login feature - Coming soon in VS Code web!");
				// TODO: Implement actual login for VS Code web extension
			} catch (error) {
				console.error("Login error:", error);
				vscode.window.showErrorMessage("Login failed: " + (error as Error).message);
			}
		}),
		vscode.commands.registerCommand("osmynt.logout", async () => {
			try {
				console.log("Osmynt: Logout command triggered");
				vscode.window.showInformationMessage("Osmynt: Logout feature - Coming soon in VS Code web!");
				// TODO: Implement actual logout for VS Code web extension
			} catch (error) {
				console.error("Logout error:", error);
				vscode.window.showErrorMessage("Logout failed: " + (error as Error).message);
			}
		}),
		vscode.commands.registerCommand("osmynt.shareCode", async () => {
			try {
				console.log("Osmynt: Share code command triggered");
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const selection = editor.document.getText(editor.selection);
					if (selection) {
						console.log("Selected code:", selection.substring(0, 100) + "...");
						vscode.window.showInformationMessage(
							"Osmynt: Code sharing feature - Coming soon in VS Code web!"
						);
						// TODO: Implement actual code sharing for VS Code web extension
					} else {
						vscode.window.showWarningMessage("Please select some code to share");
					}
				} else {
					vscode.window.showWarningMessage("No active editor found");
				}
			} catch (error) {
				console.error("Share code error:", error);
				vscode.window.showErrorMessage("Share code failed: " + (error as Error).message);
			}
		}),
		vscode.commands.registerCommand("osmynt.refreshEntry", async () => {
			try {
				console.log("Osmynt: Refresh command triggered");
				vscode.window.showInformationMessage("Osmynt: Refresh feature - Coming soon in VS Code web!");
				// TODO: Implement actual refresh for VS Code web extension
			} catch (error) {
				console.error("Refresh error:", error);
				vscode.window.showErrorMessage("Refresh failed: " + (error as Error).message);
			}
		}),
	];

	// Add all commands to the context
	commands.forEach(command => context.subscriptions.push(command));

	// Show welcome message
	vscode.window.showInformationMessage("Osmynt Web Extension is ready! Use the command palette to access features.");
}

export function deactivate() {
	console.log("Osmynt Web Extension is now deactivated");
}
