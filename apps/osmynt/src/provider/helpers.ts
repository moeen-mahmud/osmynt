import * as vscode from "vscode";
import type { TeamItemSimple, OsmyntCodeSnippet } from "./osmynt-data.provider";

export async function showAllSnippets(snippets: OsmyntCodeSnippet[]) {
	if (snippets.length === 0) return;

	// Close all existing preview editors first
	await vscode.commands.executeCommand("workbench.action.closeAllEditors");

	// Show snippets in reverse chronological order (newest first)
	const reversedSnippets = [...snippets].reverse();

	for (const [index, snippet] of reversedSnippets.entries()) {
		const doc = await vscode.workspace.openTextDocument({
			content: snippet.code,
			language: getLanguageFromFileName(snippet.editorData.fileName),
		});

		// For first snippet, use the 'Active' view column
		// For others, use 'Beside' to stack them
		const viewColumn = index === 0 ? vscode.ViewColumn.Active : vscode.ViewColumn.Beside;

		const editor = await vscode.window.showTextDocument(doc, {
			preview: false,
			viewColumn,
			preserveFocus: true,
		});

		if (editor) {
			const range = new vscode.Range(
				new vscode.Position(snippet.editorData.startLine - 1, 0),
				new vscode.Position(snippet.editorData.endLine - 1, 0)
			);
			editor.revealRange(range);
			editor.selection = new vscode.Selection(range.start, range.end);
		}
	}
}

// Helper function to get language ID from filename
export function getLanguageFromFileName(fileName: string): string {
	const ext = fileName?.split(".").pop()?.toLowerCase();
	const languageMap: { [key: string]: string } = {
		js: "javascript",
		ts: "typescript",
		py: "python",
		java: "java",
		cpp: "cpp",
		c: "c",
	};
	return languageMap[ext || ""] || "plaintext";
}

export async function getIndividualsTeam(
	targetUserName: string,
	teamsData: TeamItemSimple[] | []
): Promise<TeamItemSimple | null> {
	const team = teamsData.find(team => team.members.some(member => member.username === targetUserName));

	if (!team) {
		vscode.window.showInformationMessage(`User ${targetUserName} is not a member of any team.`);
		return null;
	}

	return team;
}
