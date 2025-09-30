import * as vscode from "vscode";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import type { StateHandler } from "../handlers/state.handle";
import { updateLoginStatusBar } from "../statusbar/login.statusbar";

export const logoutCommand = (
	context: vscode.ExtensionContext,
	provider: OsmyntDataProvider,
	state: StateHandler,
	statusBar: vscode.StatusBarItem
) =>
	vscode.commands.registerCommand("osmynt.logout", async () => {
		try {
			const token = await context.secrets.get("osmynt.token");
			const privateKey = await context.secrets.get("osmynt.privateKey");

			if (!token || !privateKey) {
				vscode.window.showInformationMessage("You are not logged in");
				return;
			}

			await context.secrets.delete("osmynt.token");
			await context.secrets.delete("osmynt.privateKey");
			state.updateState({
				isLoggedIn: false,
			});
			// Clear the tree view
			provider.clearAllTreeItems();

			// stop real-time updates
			vscode.commands.executeCommand("osmynt.disconnect");
			vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", false);

			updateLoginStatusBar(statusBar, false);
		} catch (error) {
			vscode.window.showErrorMessage("An error occurred while logging out");
		}
	});
