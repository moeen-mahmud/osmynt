import * as vscode from "vscode";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { leaveTeam } from "../services/leave-team.service";

export const leaveTeamCommand = (context: vscode.ExtensionContext, osmyntProvider: OsmyntDataProvider) =>
	vscode.commands.registerCommand("osmynt.leaveTeam", async () => {
		const token = await context.secrets.get("osmynt.token");
		const privateKey = await context.secrets.get("osmynt.privateKey");
		const owner = osmyntProvider.getUserInfo();
		const userTeams = osmyntProvider.getUserTeamStore();

		// get the team id where the user is a member not the owner
		const joinedTeams = userTeams.filter(team => team.teamOwnerId !== owner?.id);

		if (!owner) {
			vscode.window.showErrorMessage("User information is missing.");
			return;
		}

		if (!token || !privateKey) {
			vscode.window.showErrorMessage("Authentication credentials not found. Please log in again.");
			return;
		}

		let selectedItem: vscode.QuickPickItem | string = "";

		const teamToLeave = await vscode.window.showQuickPick(
			joinedTeams.map(team => ({
				label: team.teamName,
				description: team.teamId,
			})),
			{
				title: "Select a team to leave",
				placeHolder: "Select a team to leave",
				ignoreFocusOut: true,
				onDidSelectItem: item => {
					selectedItem = item;
				},
			}
		);

		if (!teamToLeave) {
			vscode.window.showWarningMessage("No team selected.");
			return;
		}

		const teamId = JSON.parse(JSON.stringify(teamToLeave)).description;

		await leaveTeam({ teamId, token });
		vscode.commands.executeCommand("osmynt.refreshEntry");

		vscode.window.showInformationMessage(`Successfully left from ${teamToLeave?.label}`);
	});
