import * as vscode from "vscode";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { joinTeam } from "../services/team.service";

export const joinTeamCommand = (context: vscode.ExtensionContext, osmyntProvider: OsmyntDataProvider) =>
	vscode.commands.registerCommand("osmynt.joinTeam", async () => {
		const token = await context.secrets.get("osmynt.token");
		const privateKey = await context.secrets.get("osmynt.privateKey");
		const owner = osmyntProvider.getUserInfo();
		const teamData = osmyntProvider.getUserTeamStore();

		if (!token || !privateKey) {
			vscode.window.showErrorMessage("Authentication credentials not found. Please log in again.");
			return;
		}

		if (!owner) {
			vscode.window.showErrorMessage("User information is missing.");
			return;
		}

		if (!teamData.length) {
			vscode.window.showErrorMessage("No team found.");
			return;
		}

		const inviteLink = await vscode.window.showInputBox({
			title: "Team invitation link",
			placeHolder: "Paste the team invitation link",
			prompt: "Please enter the team invitation link to join the team",
			ignoreFocusOut: true,
			validateInput: value => {
				if (!value) {
					return "Team invitation link is required.";
				}
			},
		});

		if (!inviteLink) {
			vscode.window.showErrorMessage("Team invitation link is required.");
			return;
		}

		const response = await joinTeam({
			token,
			inviteToken: inviteLink?.split("/").pop() || "",
		});

		if (!response) {
			vscode.window.showErrorMessage("Failed to join team.");
			return;
		}

		// execute the command to refresh the team list
		vscode.commands.executeCommand("osmynt.refreshEntry");

		vscode.window.showInformationMessage("Successfully joined the team.");
	});
