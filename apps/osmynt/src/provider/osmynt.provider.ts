import * as vscode from "vscode";
import type { OsmyntNodeKind, TeamsMeResponse, UserPublic, Team } from "@/types/osmynt.types";
import { getBaseAndAccess, getDeviceState } from "@/services/osmynt.services";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import { ACCESS_SECRET_KEY } from "@/constants/osmynt.constant";

class OsmyntItem extends vscode.TreeItem {
	kind: OsmyntNodeKind;
	data?: any;
	constructor(
		kind: OsmyntNodeKind,
		label: string,
		collapsible: vscode.TreeItemCollapsibleState,
		data?: any, // Keep as any for flexibility with different data types
		icon?: string
	) {
		super(label, collapsible);
		this.kind = kind;
		this.data = data;
		if (icon) this.iconPath = new vscode.ThemeIcon(icon);
		if (kind === "team") this.contextValue = "teamItem";
		if (kind === "member") this.contextValue = "memberItem";
	}
}

export class OsmyntTreeProvider implements vscode.TreeDataProvider<OsmyntItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

	private cachedTeams: Team[] = [];
	private cachedMembersByTeam: Record<string, UserPublic[]> = {};
	private cachedRecentByTeam: Record<string, any[]> = {}; // Keep as any for flexibility
	private cachedDmByUserId: Record<string, any[]> = {}; // Keep as any for flexibility
	private currentUserId: string | undefined;

	constructor(private readonly context: vscode.ExtensionContext) {}

	getTreeItem(element: OsmyntItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: OsmyntItem): Promise<OsmyntItem[]> {
		try {
			// Root
			if (!element) {
				// Suppress entire tree when device is not registered (server-verifiable)
				const ds = await getDeviceState(this.context);
				if (ds.kind === "removed" || ds.kind === "unpaired") return [];
				await this.ensureTeams();
				if (!Array.isArray(this.cachedTeams) || this.cachedTeams.length === 0) {
					// const emptyItem = new OsmyntItem(
					// 	"action",
					// 	"Log in to get started",
					// 	vscode.TreeItemCollapsibleState.None,
					// 	undefined,
					// 	"github"
					// );
					// emptyItem.command = { command: "osmynt.login", title: "Login", arguments: [] };
					// return [emptyItem];
					return [];
				}
				return this.cachedTeams.map(
					t =>
						new OsmyntItem(
							"team",
							`Team: ${t.name}`,
							vscode.TreeItemCollapsibleState.Expanded,
							t,
							"briefcase"
						)
				);
			}

			// Children of team
			if (element.kind === "team") {
				const teamId = element.data?.id as string;
				const members = this.cachedMembersByTeam[teamId] ?? [];
				const unread = await this.getUnreadCount(teamId);
				const membersRoot = new OsmyntItem(
					"membersRoot",
					`Members (${members.length})`,
					vscode.TreeItemCollapsibleState.Collapsed,
					{ teamId },
					"organization"
				);
				const recentRoot = new OsmyntItem(
					"recentRoot",
					unread > 0 ? `Recent Snippets (${unread} new)` : "Recent Snippets",
					vscode.TreeItemCollapsibleState.Collapsed,
					{ teamId },
					"symbol-snippet"
				);

				return [membersRoot, recentRoot];
			}

			// Children of members root
			if (element.kind === "membersRoot") {
				const teamId = element.data?.teamId as string;
				const list = this.cachedMembersByTeam[teamId] ?? [];
				const isOwner =
					(this.cachedTeams.find(t => t.id === teamId)?.ownerId as string | undefined) === this.currentUserId;
				return list.map(m => {
					const item = new OsmyntItem(
						"member",
						m.name || m.email,
						m.id === this.currentUserId
							? vscode.TreeItemCollapsibleState.None
							: vscode.TreeItemCollapsibleState.Collapsed,
						{ ...m, teamId },
						"person"
					);
					item.description = m.email;
					// Mark removable only if current user owns this team and target is not self
					if (isOwner && m.id !== this.currentUserId) {
						item.contextValue = "memberItemOwner";
					}
					return item;
				});
			}
			// Children of member node → show DM recent with that member
			if (element.kind === "member") {
				const teamId = element.data?.teamId as string;
				const authorId = element.data?.id as string;
				const labelText = `Recent Snippets from ${element.label}`;
				const node = new OsmyntItem(
					"recentRoot",
					labelText,
					vscode.TreeItemCollapsibleState.Collapsed,
					{ teamId, authorId, dmUserId: authorId },
					"symbol-snippet"
				);
				return [node];
			}

			// Children of recent root
			if (element.kind === "recentRoot") {
				const dmUserId = element.data?.dmUserId as string | undefined;
				if (dmUserId) {
					await this.ensureDm(dmUserId);
					const dms = this.cachedDmByUserId[dmUserId] ?? [];
					// Show only messages authored by the selected member for "Recent from {User}"
					const incoming = dms.filter((s: any) => s.authorId === dmUserId);
					return incoming.map(s => {
						const baseLabel = s.metadata?.title ? `${s.metadata.title}` : `Snippet ${s.id.slice(0, 6)}`;
						const by = s.authorName ? ` by ${s.authorName}` : "";
						const badges: string[] = [];
						if (s.metadata?.fileExt) badges.push(s.metadata.fileExt);
						if (s.metadata?.project) badges.push(s.metadata.project);
						const badgeStr = badges.length ? ` [${badges.join(" · ")}]` : "";
						const label = `${baseLabel}${by}${badgeStr}`;
						const item = new OsmyntItem("action", label, vscode.TreeItemCollapsibleState.None, s);
						item.contextValue = "snippetItem";
						item.command = { command: "osmynt.viewSnippet", title: "View Snippet", arguments: [s.id] };
						item.description = new Date(s.createdAt).toLocaleString();
						item.iconPath = new vscode.ThemeIcon("code");
						return item;
					});
				}
				const teamId = element.data?.teamId as string;
				const authorId =
					(element.data?.authorId as string | undefined) || (await this.getTeamAuthorFilter(teamId));
				await this.ensureRecent(teamId, authorId);
				const recents = (this.cachedRecentByTeam[teamId] ?? []).filter(
					s => !authorId || s.authorId === authorId
				);
				return recents.map(s => {
					const baseLabel = s.metadata?.title ? `${s.metadata.title}` : `Snippet ${s.id.slice(0, 6)}`;
					const by = s.authorName ? ` by ${s.authorName}` : "";
					const badges: string[] = [];
					if (s.metadata?.fileExt) badges.push(s.metadata.fileExt);
					if (s.metadata?.project) badges.push(s.metadata.project);
					const badgeStr = badges.length ? ` [${badges.join(" · ")}]` : "";
					const label = `${baseLabel}${by}${badgeStr}`;
					const item = new OsmyntItem("action", label, vscode.TreeItemCollapsibleState.None, s);
					item.contextValue = "snippetItem";
					item.command = { command: "osmynt.viewSnippet", title: "View Snippet", arguments: [s.id] };
					item.description = new Date(s.createdAt).toLocaleString();
					item.iconPath = new vscode.ThemeIcon("code");
					return item;
				});
			}
			// const emptyItem = new OsmyntItem(
			// 	"action",
			// 	"Log in to get started",
			// 	vscode.TreeItemCollapsibleState.None,
			// 	undefined,
			// 	"github"
			// );
			// emptyItem.command = { command: "osmynt.login", title: "Login", arguments: [] };
			// return [emptyItem];
			return [];
		} catch {
			// If user isn't logged in yet, return empty to allow viewsWelcome to show
			try {
				const access = await this.context.secrets.get(ACCESS_SECRET_KEY);
				if (!access) return [];
			} catch {}
			return [];
			// User appears logged in → show a single error item
			// const errorItem = new OsmyntItem(
			// 	"action",
			// 	"Something went wrong. Please log in again.",
			// 	vscode.TreeItemCollapsibleState.None,
			// 	undefined,
			// 	"alert"
			// );
			// return [errorItem];
		}
	}

	async ensureTeams() {
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access) {
			this.cachedTeams = [];
			this.cachedMembersByTeam = {};
			return;
		}
		const res = await fetch(
			// `${base}/protected/teams/me`,
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`,
			{ headers: { Authorization: `Bearer ${access}` } }
		);
		const j: TeamsMeResponse = await res.json();
		if (!res.ok || !Array.isArray(j?.teams)) {
			this.cachedTeams = [];
			this.cachedMembersByTeam = {};
			return;
		}
		this.cachedTeams = (j.teams ?? []) as Team[];
		this.cachedMembersByTeam = j.membersByTeam ?? {};
		this.currentUserId = (j?.user?.id as string | undefined) ?? undefined;
	}

	private async ensureRecent(teamId: string, authorId?: string) {
		// Do not fetch or render snippets if device is unregistered (server check)
		{
			const ds = await getDeviceState(this.context);
			if (ds.kind === "removed" || ds.kind === "unpaired") {
				this.cachedRecentByTeam[teamId] = [];
				return;
			}
		}
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access || !teamId) {
			this.cachedRecentByTeam[teamId] = [];
			return;
		}
		const url = authorId
			? // `${base}/protected/code-share/team/${encodeURIComponent(teamId)}/by-author/${encodeURIComponent(authorId)}`
				`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.listTeamByAuthor(encodeURIComponent(teamId), encodeURIComponent(authorId))}`
			: // `${base}/protected/code-share/team/list?teamId=${encodeURIComponent(teamId)}`;
				`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.listTeam}?teamId=${encodeURIComponent(teamId)}`;
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j: any = await res.json();
		this.cachedRecentByTeam[teamId] = Array.isArray(j.items) ? j.items : [];
		// update last seen and unread
		const latest = this.cachedRecentByTeam[teamId][0]?.createdAt as string | undefined;
		if (latest) {
			await this.setLastSeen(teamId, latest);
		}
	}

	private async ensureDm(otherUserId: string) {
		// Do not fetch or render DM snippets if device is unregistered (server check)
		{
			const ds = await getDeviceState(this.context);
			if (ds.kind === "removed" || ds.kind === "unpaired") {
				this.cachedDmByUserId[otherUserId] = [];
				return;
			}
		}
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access || !otherUserId) {
			this.cachedDmByUserId[otherUserId] = [];
			return;
		}
		const res = await fetch(
			// `${base}/protected/code-share/dm/with/${encodeURIComponent(otherUserId)}`,
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.dmWith(encodeURIComponent(otherUserId))}`,
			{
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const j: any = await res.json();
		this.cachedDmByUserId[otherUserId] = Array.isArray(j.items) ? j.items : [];
	}

	private async getUnreadCount(teamId: string): Promise<number> {
		const lastSeen = await this.getLastSeen(teamId);
		const recents = this.cachedRecentByTeam[teamId] ?? [];
		if (!lastSeen) return recents.length;
		return recents.filter((r: any) => new Date(r.createdAt) > new Date(lastSeen)).length;
	}

	private async getLastSeen(teamId: string): Promise<string | undefined> {
		try {
			return (await vscode.commands.executeCommand("getContext", `osmynt.lastSeen.${teamId}`)) as
				| string
				| undefined;
		} catch {
			return undefined;
		}
	}

	private async setLastSeen(teamId: string, iso: string) {
		try {
			await vscode.commands.executeCommand("setContext", `osmynt.lastSeen.${teamId}`, iso);
		} catch {}
	}

	private async getTeamAuthorFilter(teamId: string): Promise<string | undefined> {
		try {
			return this.context.globalState.get<string>(`osmynt.filter.${teamId}`) ?? undefined;
		} catch {
			return undefined;
		}
	}

	refresh() {
		// clear cache and notify
		this.cachedTeams = [];
		this.cachedMembersByTeam = {};
		this.cachedRecentByTeam = {};
		this.cachedDmByUserId = {};
		this._onDidChangeTreeData.fire();
	}
}
