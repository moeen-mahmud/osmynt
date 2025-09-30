import * as vscode from "vscode";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { inviteTeamMember } from "../services/team.service";
import { getIndividualsTeam } from "../provider/helpers";

export const inviteTeamMemberCommand = (context: vscode.ExtensionContext, osmyntProvider: OsmyntDataProvider) =>
	vscode.commands.registerCommand("osmynt.inviteTeamMember", async () => {
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

		const team = await getIndividualsTeam(owner.username, teamData);

		if (!team) {
			vscode.window.showErrorMessage("You are not a member of any team.");
			return;
		}

		const invitation = await inviteTeamMember({
			token,
			teamId: team.teamId,
		});

		if (!invitation) {
			vscode.window.showErrorMessage("Failed to invite team member.");
			return;
		}

		vscode.window.showInputBox({
			title: "Team invitation link",
			value: invitation.inviteLink,
			/**
			 * @todo change the prompt message once the webapp is ready to handle the invitation link
			 */
			prompt: "Copy the invitation link and ask them to paste it in the join team dialog.",
			ignoreFocusOut: true,
			valueSelection: [0, invitation.inviteLink.length],
		});

		// automatically copy the invitation link to the clipboard
		await vscode.env.clipboard.writeText(invitation.inviteLink);
		vscode.window.showInformationMessage("Invitation link copied to clipboard.");
	});
