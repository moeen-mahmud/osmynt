import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import type { OsmyntCodeSnippet } from "./osmynt-data.provider";

export class OsmyntCodeItem extends vscode.TreeItem {
	constructor(label: string, icon?: string) {
		super(label, vscode.TreeItemCollapsibleState.None);
		this.tooltip = `${this.label}`;

		if (icon) {
			// If an icon is provided, set it using ThemeIcon
			this.iconPath = new vscode.ThemeIcon(icon);
		}
	}
}
export class OsmyntCodeUserItem extends vscode.TreeItem {
	constructor(
		public readonly username: string,
		public readonly userId: string
	) {
		super(username, vscode.TreeItemCollapsibleState.None);
		this.id = uuid();
		this.contextValue = "osmyntUser";
	}
}

export class OsmyntConnectionsItem extends vscode.TreeItem {
	private _connectedUsers: OsmyntCodeUserItem[] = [];

	constructor(
		public readonly label: string,
		connectedUsers: { username: string; userId: string }[]
	) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
		this.id = label;
		this.contextValue = "osmyntConnections";

		this._connectedUsers = connectedUsers.map(user => new OsmyntCodeUserItem(user.username, user.userId));
	}

	getChildren(): vscode.TreeItem[] {
		// Return the connected users as children when the item is expanded
		return this._connectedUsers;
	}
}

export class OsmyntCodeViewItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly code: string,
		public readonly filename: string,
		public readonly languageId: string,
		public readonly startLine: number,
		public readonly endLine: number
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		// Preview the snippet content using Markdown
		this.iconPath = new vscode.ThemeIcon("code");
		this.description = `File: ${this.filename}, Lines: ${this.startLine}-${this.endLine}`;
		this.contextValue = "codeSnippet";

		// Command to open snippet in an editor
		this.command = {
			command: "osmynt.showSnippet",
			title: "Show Snippet",
			arguments: [this.code, this.filename, this.startLine, this.endLine],
		};
	}
}

export class CodeLineItem extends vscode.TreeItem {
	constructor(
		public readonly lineNumber: number,
		public readonly code: string
	) {
		super(code, vscode.TreeItemCollapsibleState.None);
		this.description = `${lineNumber}`;
		this.contextValue = "codeLine";
	}
}

export class TeamItem extends vscode.TreeItem {
	private _members: TeamMemberItem[] = [];

	constructor(
		public readonly teamName: string,
		members: { username: string; userId: string }[]
	) {
		super(teamName, vscode.TreeItemCollapsibleState.Collapsed);
		this.contextValue = "team";
		this._members = members.map(member => new TeamMemberItem(member.username, member.userId, "person"));
	}

	getChildren(): vscode.TreeItem[] {
		return this._members;
	}
}

export class TeamMemberItem extends vscode.TreeItem {
	private _snippets: OsmyntCodeViewItem[] = [];

	constructor(
		public readonly username: string,
		public readonly userId: string,
		icon?: string
	) {
		super(username, vscode.TreeItemCollapsibleState.None);
		this.id = uuid();
		this.contextValue = "teamMember";

		if (icon) {
			this.iconPath = new vscode.ThemeIcon(icon);
		}
	}

	// New method to add snippets
	addSnippets(snippets: OsmyntCodeSnippet[]) {
		// If there are snippets, change collapsible state
		if (snippets.length > 0) {
			this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		}

		// Create code view items for each snippet from this member
		this._snippets = snippets.map(
			code =>
				new OsmyntCodeViewItem(
					`${code.subject} shared by ${code.sendBy.username}`,
					code.code,
					code.editorData.fileName,
					code.editorData.languageId,
					code.editorData.startLine,
					code.editorData.endLine
				)
		);
	}

	// Method to get snippets
	getSnippets(): OsmyntCodeViewItem[] {
		return this._snippets;
	}
}
