import * as vscode from "vscode";
import { OsmyntDataProvider } from "./provider/osmynt-data.provider";
import { registerSnippetProviders } from "./provider/ghosted-inline-completion.provider";
import { loginCommand } from "./commands/login.command";
import { logoutCommand } from "./commands/logout.command";
import { validateAndRefreshToken } from "./handlers/token-validation.handle";
import { setupUserAndConnections } from "./handlers/user.handle";
import { getLanguageFromFileName, showAllSnippets } from "./provider/helpers";
import { initializeExtension } from "./handlers/extension-init.handle";
import { StateHandler } from "./handlers/state.handle";
import { setupWebSocketConnection } from "./handlers/websocket-connection.handle";
import { shareCodeViaOsmyntCommand } from "./commands/share-code.command";
import { setupUserTeams } from "./handlers/user-teams.handle";
import { inviteTeamMemberCommand } from "./commands/invite-team-member.command";
import { joinTeamCommand } from "./commands/join-team.command";
import { updateLoginStatusBar } from "./statusbar/login.statusbar";
import { leaveTeamCommand } from "./commands/leave-team.command";

let loginStatusBarItem: vscode.StatusBarItem;

export const activate = async (context: vscode.ExtensionContext) => {
	const osmyntProvider = new OsmyntDataProvider(context);
	const stateHandler = new StateHandler();

	const {
		ghostTextProvider: inlineCompletionProvider,
		codeLensProvider,
		snippetTracker,
	} = registerSnippetProviders(context);

	const treeView = vscode.window.createTreeView("osmyntView", {
		treeDataProvider: osmyntProvider,
		showCollapseAll: false,
	});

	// LOGIN STATUS BAR ITEM
	loginStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	context.subscriptions.push(
		loginCommand(context, stateHandler, loginStatusBarItem),
		logoutCommand(context, osmyntProvider, stateHandler, loginStatusBarItem),
		shareCodeViaOsmyntCommand(context, osmyntProvider),
		inviteTeamMemberCommand(context, osmyntProvider),
		joinTeamCommand(context, osmyntProvider),
		loginStatusBarItem,
		leaveTeamCommand(context, osmyntProvider),
		treeView,
		vscode.commands.registerCommand("osmynt.refreshEntry", async () => {
			try {
				const token = await validateAndRefreshToken(context, stateHandler);
				if (!token) return;

				const user = await setupUserAndConnections(token, osmyntProvider);

				await setupUserTeams(token, osmyntProvider);
				const isInitialized = stateHandler.getState().isInitialized;
				if (user && !isInitialized) {
					stateHandler.updateState({
						socket: (await setupWebSocketConnection(
							context,
							user,
							osmyntProvider,
							stateHandler,
							loginStatusBarItem
						)) as WebSocket,
						isLoggedIn: true,
					});
				}

				vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", true);
				// vscode.commands.executeCommand("setContext", "osmynt.isRealtime", true);

				osmyntProvider.refresh();
				inlineCompletionProvider.updateSnippets(osmyntProvider.getAllSnippets());
			} catch (error) {
				console.error("Error refreshing extension:", error);
				vscode.window.showErrorMessage("Failed to refresh Osmynt extension");
			}
		}),

		vscode.window.onDidChangeActiveTextEditor(() => {
			inlineCompletionProvider.updateSnippets(osmyntProvider.getAllSnippets());
			updateLoginStatusBar(loginStatusBarItem, stateHandler.getState().isLoggedIn);
		}),

		vscode.workspace.onDidChangeTextDocument(() => {
			inlineCompletionProvider.updateSnippets(osmyntProvider.getAllSnippets());
		}),

		// check if the osmynt view is visible

		treeView.onDidChangeVisibility(async e => {
			if (e.visible) {
				await showAllSnippets(osmyntProvider.getAllSnippets());
				inlineCompletionProvider.updateSnippets(osmyntProvider.getAllSnippets());

				vscode.commands.executeCommand("setContext", "osmyntViewActive", true);
			} else {
				vscode.commands.executeCommand("setContext", "osmyntViewActive", false);
			}
		}),

		vscode.commands.registerCommand("osmynt.showSnippet", async (code: string, fileName: string) => {
			if (!code) {
				vscode.window.showWarningMessage("No code snippet is selected");
				return;
			}

			const doc = await vscode.workspace.openTextDocument({
				content: code,
				language: getLanguageFromFileName(fileName) || "plaintext",
			});

			await vscode.window.showTextDocument(doc, {
				preview: false,
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true,
			});
		})
	);

	console.log(
		`
		*************************************
		🚀 Osmynt extension is now active!
		*************************************
		`
	);
	await initializeExtension(
		context,
		osmyntProvider,
		inlineCompletionProvider,
		treeView,
		stateHandler,
		loginStatusBarItem
	);

	updateLoginStatusBar(loginStatusBarItem, stateHandler.getState().isLoggedIn);
};

export const deactivate = () => {};
