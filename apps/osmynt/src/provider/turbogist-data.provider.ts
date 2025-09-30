import * as vscode from "vscode";
import { CodeLineItem, OsmyntCodeItem, OsmyntCodeViewItem, TeamItem, TeamMemberItem } from "./view-data.provider";

export type UserInfo = {
	id: string;
	username: string;
	email: string;
	name: string;
};

type EditorData = {
	fileName: string;
	languageId: string;
	startLine: number;
	endLine: number;
};

export interface OsmyntCodeSnippet {
	action: string;
	subject: string;
	code: string;
	editorData: EditorData;
	sendBy: {
		_id: string;
		username: string;
	};
}

export type TeamItemSimple = {
	teamName: string;
	teamId: string;
	teamOwnerId: string;
	members: { username: string; userId: string }[];
};

export class OsmyntDataProvider
	implements vscode.TreeDataProvider<OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | TeamMemberItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<
		// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
		OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | undefined | void
	> =
		// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
		new vscode.EventEmitter<OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<
		// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
		OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | undefined | void
	> = this._onDidChangeTreeData.event;

	private userInfo: UserInfo | null = null;
	private receivedCode: OsmyntCodeSnippet[] = [];

	private userTeams: TeamItem[] = [];
	private userTeamsStore: TeamItemSimple[] | [] = [];

	setUserTeams(teams: TeamItemSimple[]): void {
		this.userTeams = teams.map(team => new TeamItem(team.teamName, team.members));
		this._onDidChangeTreeData.fire();
	}

	setUserTeamStore(teams: TeamItemSimple[]): void {
		this.userTeamsStore = teams;
	}

	getUserTeamStore(): TeamItemSimple[] | [] {
		return this.userTeamsStore;
	}

	getUserTeams(): TeamItem[] {
		return this.userTeams;
	}

	constructor(private context: vscode.ExtensionContext) {}

	setUserInfo(userInfo: UserInfo): void {
		this.userInfo = userInfo;
		this._onDidChangeTreeData.fire();
	}

	getUserInfo(): UserInfo | null {
		return this.userInfo;
	}

	addReceivedCode(snippet: OsmyntCodeSnippet): void {
		this.receivedCode.push(snippet);
		this.refresh();

		vscode.window.showInformationMessage(
			snippet.action === "share_team_code"
				? `A new team snippet shared by ${snippet.sendBy.username} 🔥`
				: `A new snippet received from ${snippet.sendBy.username} 🚀`
		);
		vscode.commands.executeCommand("workbench.view.extension.osmyntView");
	}

	getAllSnippets(): OsmyntCodeSnippet[] {
		return [...this.receivedCode];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: OsmyntCodeItem | OsmyntCodeViewItem): vscode.TreeItem {
		return element;
	}

	clearAllTreeItems(): void {
		this.userInfo = null;
		this.receivedCode = [];
		this.userTeams = [];
		this.userTeamsStore = [];
		this.refresh();
	}

	getChildren(
		element?: OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | TeamMemberItem
	): Thenable<(OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | TeamMemberItem)[]> {
		const items: (OsmyntCodeItem | OsmyntCodeViewItem | CodeLineItem | TeamMemberItem)[] = [];

		if (!element) {
			if (this.userInfo) {
				items.push(new OsmyntCodeItem(`Hi ${this.userInfo.name}`, "account"));
				items.push(new OsmyntCodeItem(`${this.userInfo.username}`, "github"));
			}

			// Group snippets by sender
			const snippetsBySender = this.receivedCode.reduce(
				(acc, snippet) => {
					const username = snippet.sendBy.username;
					if (!acc[username]) {
						acc[username] = [];
					}
					acc[username].push(snippet);
					return acc;
				},
				{} as Record<string, OsmyntCodeSnippet[]>
			);

			// Add teams with updated members
			const updatedTeams = this.userTeams.map(team => {
				// Update team members with their snippets
				const updatedMembers = team.getChildren().map(member => {
					if (member instanceof TeamMemberItem) {
						const memberSnippets = snippetsBySender[member.username] || [];
						member.addSnippets(memberSnippets);
					}
					return member;
				});

				// Update the team's children method to use updated members
				team.getChildren = () => updatedMembers;
				return team;
			});

			items.push(...updatedTeams);
		} else if (element instanceof OsmyntCodeViewItem) {
			// Show code lines when expanding a snippet
			const lines = element.code?.split("\n");
			return Promise.resolve(lines.map((line, index) => new CodeLineItem(element.startLine + index, line)));
		} else if (element instanceof TeamItem) {
			// If the item is a team, get its members (now potentially with snippets)
			return Promise.resolve(element.getChildren());
		} else if (element instanceof TeamMemberItem) {
			// If the item is a team member with snippets, return their snippets
			return Promise.resolve(element.getSnippets());
		}

		return Promise.resolve(items);
	}
}
