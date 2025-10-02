import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from "@/constants/constants";
import * as vscode from "vscode";

export const OsmyntLoginCommand = async () => {
	try {
		const session = await vscode.authentication.getSession("github", ["read:user", "user:email"], {
			createIfNone: true,
		});
		if (!session) {
			vscode.window.showErrorMessage("GitHub authentication failed.");
			return;
		}
		await nativeSecureLogin(context, session.accessToken);
		try {
			await connectRealtime(context);
		} catch {}
		tree.refresh();
	} catch (e) {
		vscode.window.showErrorMessage(`Login failed: ${e}`);
	}
};

export const OsmyntLogoutCommand = async (context: vscode.ExtensionContext) => {
	await context.secrets.delete(ACCESS_SECRET_KEY);
	await context.secrets.delete(REFRESH_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", false);
	vscode.window.showInformationMessage("Logged out of Osmynt.");

	// disconnect realtime if available
	try {
		await disconnectRealtime(context);
	} catch {}
	tree.refresh();
};
