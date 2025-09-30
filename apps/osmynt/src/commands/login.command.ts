import * as vscode from "vscode";
import { login } from "../services/login.service";
import type { StateHandler } from "../handlers/state.handle";
import { updateLoginStatusBar } from "../statusbar/login.statusbar";

export const loginCommand = (context: vscode.ExtensionContext, state: StateHandler, statusBar: vscode.StatusBarItem) =>
	vscode.commands.registerCommand("osmynt.login", async () => {
		try {
			const session = await vscode.authentication.getSession("github", ["user:email"], { createIfNone: true });

			const accessToken = session.accessToken;

			const data = await login({ token: accessToken });

			await context.secrets.store("osmynt.token", data?.accessToken);
			await context.secrets.store("osmynt.privateKey", data?.privateKey);

			state.updateState({
				isLoggedIn: true,
			});

			await vscode.commands.executeCommand("osmynt.refreshEntry");

			vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", true);

			updateLoginStatusBar(statusBar, true);
		} catch (error) {
			vscode.window.showErrorMessage("Failed to login");
		}
	});
