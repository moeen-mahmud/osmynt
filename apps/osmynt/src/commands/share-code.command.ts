import * as vscode from "vscode";
import { encode, generateUniqueSnippetName } from "library";
import { shareCode, ShareType, type ShareCode } from "../services/share-code.service";
import type { OsmyntDataProvider } from "../provider/osmynt-data.provider";
import { getIndividualsTeam } from "../provider/helpers";

export const shareCodeViaOsmyntCommand = (context: vscode.ExtensionContext, osmyntProvider: OsmyntDataProvider) =>
	vscode.commands.registerCommand("osmynt.shareCode", async () => {
		const token = await context.secrets.get("osmynt.token");
		const privateKey = await context.secrets.get("osmynt.privateKey");
		const owner = osmyntProvider.getUserInfo();
		const userTeams = osmyntProvider.getUserTeamStore();

		if (!owner) {
			vscode.window.showErrorMessage("User information is missing.");
			return;
		}

		if (!token || !privateKey) {
			vscode.window.showErrorMessage("Authentication credentials not found. Please log in again.");
			return;
		}

		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showWarningMessage("No editor is active.");
			return;
		}

		// Get the selected text
		const selectedCode = editor.document.getText(editor.selection);
		if (!selectedCode) {
			vscode.window.showWarningMessage("No code is selected.");
			return;
		}

		const document = editor.document;
		const fileName = document.fileName?.split(/[\\/]/)?.pop() || "";
		const languageId = document.languageId;
		const startLine = editor.selection.start.line;
		const endLine = editor.selection.end.line;

		let selectedItem: vscode.QuickPickItem | string = "";

		const combineTeamsAndIndividuals = [
			...userTeams,
			{
				teamName: "Individuals",
				teamId: "individuals",
			},
		];

		const snippetSubject = await vscode.window.showInputBox({
			title: "Snippet Subject",
			value: generateUniqueSnippetName(),
			ignoreFocusOut: true,
			prompt: "Enter a subject for the snippet",
			validateInput: value => {
				if (!value) {
					return "Subject is required.";
				}
			},
		});

		if (!snippetSubject) {
			vscode.window.showErrorMessage("A subject is required to share code.");
			return;
		}

		const selectedTeam = await vscode.window.showQuickPick(
			combineTeamsAndIndividuals.map(team => ({
				label: team.teamName,
				description: team.teamId,
			})),
			{
				title: "Select a team or individual member",
				placeHolder: "Type to select team or individual to share code",
				ignoreFocusOut: true,
				onDidSelectItem: item => {
					selectedItem = item;
				},
			}
		);

		if (!selectedTeam) {
			vscode.window.showWarningMessage("You need to select a team or individual to share code");
			return;
		}

		// Prompt for the recipient
		if (JSON.parse(JSON.stringify(selectedItem))?.label === "Individuals") {
			const recipientUserName = await vscode.window.showInputBox({
				placeHolder: "Enter the team member's username",
				prompt: "Please enter the team member's username to send the code",
				ignoreFocusOut: true,
				validateInput: value => {
					if (!value) {
						return "Team member name is required.";
					}
				},
			});

			if (!recipientUserName) {
				vscode.window.showErrorMessage("Team member name is required.");
				return;
			}

			if (owner?.username === recipientUserName) {
				vscode.window.showWarningMessage("You cannot share code with yourself.");
				return;
			}

			// check if the user and recipient are in the same team
			const ownerUserId = owner.id;
			const teamData = osmyntProvider.getUserTeamStore();

			if (!ownerUserId) {
				vscode.window.showErrorMessage("User information is missing.");
				return;
			}

			const team = await getIndividualsTeam(recipientUserName, teamData);

			if (!team) {
				// get the team of the recipient

				vscode.window.showWarningMessage("User is not part of any team.");
				return;
			}

			const teamId = team.teamId;

			const payload: ShareCode = {
				teamId,
				recipientUserName,
				code: encode(selectedCode),
				subject: String(snippetSubject),
				editorData: {
					fileName,
					languageId,
					startLine,
					endLine,
				},
			};

			await shareCode(payload, token, ShareType.INDIVIDUAL);

			vscode.window.showInformationMessage(`Code shared with ${recipientUserName} successfully.`);
		} else {
			const teamId = JSON.parse(JSON.stringify(selectedItem))?.description;

			// check if there's any member in the team other than the owner
			const team = userTeams.find(team => team.teamId === teamId);

			if (!team) {
				vscode.window.showErrorMessage("No team found.");
				return;
			}

			const isThereAnyMember = team.members.some(member => member.userId !== owner?.id);

			if (!isThereAnyMember) {
				vscode.window.showWarningMessage("You are the only member in the team");
				return;
			}

			const payload: ShareCode = {
				teamId,
				subject: String(snippetSubject),
				code: encode(selectedCode),
				editorData: {
					fileName,
					languageId,
					startLine,
					endLine,
				},
			};

			await shareCode(payload, token, ShareType.TEAM);

			vscode.window.showInformationMessage(
				`Code shared with ${JSON.parse(JSON.stringify(selectedItem))?.label} successfully.`
			);
		}
	});
