import * as vscode from "vscode";

import type { OsmyntCodeSnippet, OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { getUserById } from "../services/get-user.service";
import { getUserTeams } from "../services/team.service";

export type EnhancedTeamMember = {
	username: string;
	userId: string;
	snippets?: OsmyntCodeSnippet[];
};

export async function setupUserTeams(token: string, osmyntProvider: OsmyntDataProvider) {
	try {
		const userTeams = await getUserTeams({ token }); // Fetch user teams

		const teamData = await Promise.all(
			userTeams.map(async team => {
				const members = await Promise.all(
					team.members.map(async member => {
						const teamMate = await getUserById({ token, userId: member.userId }); // Fetch each member’s details
						return {
							username: teamMate.username,
							userId: teamMate._id,
							snippets: [],
						};
					})
				);

				return {
					teamName: team.name,
					teamId: team._id,
					teamOwnerId: team.ownerId,
					members,
				};
			})
		);

		// Set resolved team data
		osmyntProvider.setUserTeams(teamData);
		osmyntProvider.setUserTeamStore(teamData);
	} catch (error) {
		console.error("Error setting up user teams:", error);
		vscode.window.showErrorMessage("Failed to fetch team details");
	}
}
