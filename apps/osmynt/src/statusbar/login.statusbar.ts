import * as vscode from "vscode";

export const updateLoginStatusBar = (loginStatusBarItem: vscode.StatusBarItem, isLoggedIn: boolean) => {
	if (isLoggedIn) {
		loginStatusBarItem.text = "$(zap) Osmynt";
		loginStatusBarItem.command = "osmynt.logout";
		loginStatusBarItem.tooltip = "Click to logout from Osmynt";
	} else {
		loginStatusBarItem.text = "$(debug-disconnect) Osmynt";
		loginStatusBarItem.command = "osmynt.login";
		loginStatusBarItem.tooltip = "Click to login to Osmynt";
		vscode.window.showInformationMessage("Disconnected from Osmynt");
	}
	loginStatusBarItem.show();
};
