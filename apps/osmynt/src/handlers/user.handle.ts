import * as vscode from "vscode";
import type { OsmyntDataProvider, UserInfo } from "../provider/osmynt-data.provider";
import { getLoggedInUser, getUserById } from "../services/get-user.service";
import { getUserTeams } from "../services/team.service";

export async function setupUserAndConnections(
	token: string,
	osmyntProvider: OsmyntDataProvider
): Promise<UserInfo | null> {
	try {
		const user = await getLoggedInUser({ token });

		if (!user) {
			throw new Error("Failed to fetch user information");
		}

		vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", true);
		osmyntProvider.setUserInfo({
			id: user._id,
			username: user.username,
			email: user.email,
			name: user.name,
		});

		return user;
	} catch (error) {
		console.error("Error setting up user and connections:", error);
		vscode.window.showErrorMessage("Failed to setup user information");
		return null;
	}
}
