import * as vscode from "vscode";
import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, DEVICE_ID_KEY, ENC_KEYPAIR_JWK_KEY } from "@/constants/constants";

export async function activate(context: vscode.ExtensionContext) {
	const tree = new OsmyntTreeProvider(context);
	context.subscriptions.push(vscode.window.registerTreeDataProvider("osmyntView", tree));
	treeProvider = tree;

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.login", () => handleLogin(context, tree)),
		vscode.commands.registerCommand("osmynt.logout", () => handleLogout(context, tree)),
		vscode.commands.registerCommand("osmynt.shareCode", () => handleShareCode(context)),
		vscode.commands.registerCommand("osmynt.inviteMember", () => handleInviteMember(context)),
		vscode.commands.registerCommand("osmynt.acceptInvitation", () => handleAcceptInvitation(context)),
		vscode.commands.registerCommand("osmynt.refreshTeam", () => handleRefreshTeam()),
		vscode.commands.registerCommand("osmynt.viewSnippet", (id?: string) => handleViewSnippet(context, id)),
		vscode.commands.registerCommand("osmynt.snippet.copy", async (item?: any) => {
			if (!item?.data?.id) return;
			const { base, access } = await getBaseAndAccess(context);
			const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(item.data.id)}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const j = await res.json();
			const text = await tryDecryptSnippet(context, j);
			if (text) await vscode.env.clipboard.writeText(text);
			vscode.window.showInformationMessage("Snippet copied to clipboard");
		}),
		vscode.commands.registerCommand("osmynt.snippet.openToSide", async (item?: any) => {
			await vscode.commands.executeCommand("osmynt.viewSnippet", item?.data?.id);
			await vscode.commands.executeCommand("workbench.action.moveEditorToNextGroup");
		}),
		vscode.commands.registerCommand("osmynt.snippet.insertAtCursor", async (item?: any) => {
			if (!item?.data?.id) return;
			const { base, access } = await getBaseAndAccess(context);
			const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(item.data.id)}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const j = await res.json();
			const text = await tryDecryptSnippet(context, j);
			const editor = vscode.window.activeTextEditor;
			if (text && editor) editor.edit(b => b.insert(editor.selection.active, text));
		}),
		vscode.commands.registerCommand("osmynt.filterRecentsByMember", async (item?: any) => {
			if (!item?.data?.id || !item?.data?.teamId) return;
			await context.globalState.update(`osmynt.filter.${item.data.teamId}`, item.data.id);
			await vscode.commands.executeCommand("setContext", `osmynt.filter.${item.data.teamId}`, item.data.id);
			treeProvider?.refresh();
		}),
		vscode.commands.registerCommand("osmynt.clearRecentsFilter", async (item?: any) => {
			const teamId = item?.data?.id || item?.data?.teamId;
			if (!teamId) return;
			await context.globalState.update(`osmynt.filter.${teamId}`, undefined);
			await vscode.commands.executeCommand("setContext", `osmynt.filter.${teamId}`, undefined);
			treeProvider?.refresh();
		})
	);

	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", Boolean(access));
	if (access) {
		try {
			await ensureDeviceKeys(context);
		} catch {
			// vscode.window.showErrorMessage("Failed to ensure device keys");
		}
		try {
			if (!realtimeChannel) {
				await connectRealtime(context);
			}
		} catch {}
	}
}

export function deactivate() {}
let supabaseClient: SupabaseClient | null = null;
let realtimeChannel: RealtimeChannel | null = null;
let treeProvider: OsmyntTreeProvider | null = null;

// Command handlers
async function handleLogin(context: vscode.ExtensionContext, tree: OsmyntTreeProvider) {
	try {
		const session = await vscode.authentication.getSession("github", ["read:user", "user:email"], {
			createIfNone: true,
		});
		if (!session) {
			vscode.window.showErrorMessage("GitHub authentication failed.");
			return;
		}
		await nativeSecureLogin(context, session.accessToken);
		try {
			await connectRealtime(context);
		} catch {
			// vscode.window.showErrorMessage("Failed to connect to realtime");
		}
		tree.refresh();
	} catch (e) {
		vscode.window.showErrorMessage(`Login failed: ${e}`);
	}
}

async function handleLogout(context: vscode.ExtensionContext, tree: OsmyntTreeProvider) {
	await context.secrets.delete(ACCESS_SECRET_KEY);
	await context.secrets.delete(REFRESH_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", false);
	vscode.window.showInformationMessage("Logged out of Osmynt.");
	try {
		await disconnectRealtime(context);
	} catch {}
	tree.refresh();
}

async function handleShareCode(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;
	if (!editor || editor.selection.isEmpty) {
		vscode.window.showWarningMessage("Select some code to share.");
		return;
	}
	const selected = editor.document.getText(editor.selection);
	const includeContext = await vscode.window.showQuickPick(
		[{ label: "Include file name and extension", picked: true }, { label: "Don't include" }],
		{ canPickMany: false, placeHolder: "Include file context in snippet metadata?" }
	);
	const title = await vscode.window.showInputBox({ prompt: "Snippet title (required)" });
	if (!title || title.trim().length === 0) {
		vscode.window.showWarningMessage("Snippet title is required.");
		return;
	}
	const target = await pickShareTarget(context);
	try {
		await ensureDeviceKeys(context);
		const editorFile = editor.document.uri.fsPath || "";
		const metadataExtra: any = {};
		if (includeContext?.label?.startsWith("Include")) {
			metadataExtra.filePath = editorFile;
			metadataExtra.fileExt = (editorFile.split(".").pop() || "").toLowerCase();
		}
		await shareSelectedCode(context, selected, title.trim(), target, metadataExtra);
		vscode.window.showInformationMessage("Osmynt: Snippet shared securely");
	} catch (e) {
		vscode.window.showErrorMessage(`Share failed: ${e}`);
	}
}

async function handleInviteMember(context: vscode.ExtensionContext) {
	try {
		const teamId = await promptTeamId(context);
		if (!teamId) {
			vscode.window.showWarningMessage("No team ID provided");
			return;
		}
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/protected/teams/${encodeURIComponent(teamId)}/invite`, {
			method: "POST",
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		await vscode.env.clipboard.writeText(j.token);
		vscode.window.showInformationMessage("Invitation token copied to clipboard");
	} catch (e) {
		vscode.window.showErrorMessage(`Invite failed: ${e}`);
	}
}

async function handleAcceptInvitation(context: vscode.ExtensionContext) {
	try {
		const raw = await vscode.window.showInputBox({ prompt: "Enter invitation token or URL" });
		if (!raw) return;
		const token = extractInviteToken(raw);
		if (!token) return;
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/protected/teams/invite/${encodeURIComponent(token)}`, {
			method: "POST",
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		vscode.window.showInformationMessage("Joined team successfully");
		// refresh the team view
		(await import("vscode")).commands.executeCommand("workbench.view.extension.osmynt");
		setTimeout(() => {
			// force refresh by toggling view
			vscode.commands.executeCommand("workbench.action.closePanel");
			vscode.commands.executeCommand("workbench.view.extension.osmynt");
		}, 150);
	} catch (e) {
		vscode.window.showErrorMessage(`Accept failed: ${e}`);
	}
}

async function handleRefreshTeam() {
	try {
		await vscode.commands.executeCommand("workbench.view.extension.osmynt");
		treeProvider?.refresh();
	} catch {}
}

async function handleViewSnippet(context: vscode.ExtensionContext, id?: string) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const snippetId = id ?? (await vscode.window.showInputBox({ prompt: "Enter snippet id" }));
		if (!snippetId) return;
		const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(snippetId)}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		const text = await tryDecryptSnippet(context, j);
		const fileExt = (j?.metadata?.fileExt as string | undefined)?.toLowerCase();
		const languageByExt: Record<string, string> = {
			js: "javascript",
			ts: "typescript",
			jsx: "javascriptreact",
			tsx: "typescriptreact",
			py: "python",
			go: "go",
			java: "java",
			kt: "kotlin",
			cs: "csharp",
			cpp: "cpp",
			c: "c",
			rb: "ruby",
			php: "php",
			rs: "rust",
			scss: "scss",
			css: "css",
			html: "html",
			json: "json",
			yml: "yaml",
			yaml: "yaml",
			sh: "shellscript",
			md: "markdown",
		};
		const language = (fileExt && languageByExt[fileExt]) || "plaintext";
		const doc = await vscode.workspace.openTextDocument({
			language,
			content: text ?? "[Encrypted snippet opened. Decrypt failed or not addressed to this device.]",
		});
		await vscode.window.showTextDocument(doc, { preview: false });
	} catch (e) {
		vscode.window.showErrorMessage(`Open failed: ${e}`);
	}
}

async function connectRealtime(_context: vscode.ExtensionContext) {
	if (realtimeChannel) return; // already connected
	const cfg = vscode.workspace.getConfiguration("osmynt");
	let url = "";
	let anon = "";
	// Prefer server-provided config; fallback to local
	try {
		const { base, access } = await getBaseAndAccess(_context);
		const res = await fetch(`${base}/protected/code-share/realtime-config`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (j?.url && j?.anonKey) {
			url = j.url;
			anon = j.anonKey;
		}
	} catch {}
	if (!url || !anon) {
		url = cfg.get<string>("supabaseUrl") || url;
		anon = cfg.get<string>("supabaseAnonKey") || anon;
	}
	if (!url || !anon) {
		vscode.window.showWarningMessage("Error connecting to realtime. Please check your configuration.");
		return;
	}
	supabaseClient = createClient(url, anon, { realtime: { params: { eventsPerSecond: 3 } } });
	const channel = supabaseClient.channel("osmynt-recent-snippets");
	realtimeChannel = channel
		.on("broadcast", { event: "snippet:created" }, async _payload => {
			try {
				// Only refresh if user is logged in and the view is active context
				const loggedIn = await vscode.commands.executeCommand("getContext", "osmynt.isLoggedIn");
				if (loggedIn) {
					treeProvider?.refresh();
				}
			} catch {}
		})
		.subscribe();
}

async function disconnectRealtime(_context: vscode.ExtensionContext) {
	try {
		await realtimeChannel?.unsubscribe();
	} catch {}
	try {
		await supabaseClient?.removeAllChannels();
	} catch {}
	realtimeChannel = null;
	supabaseClient = null;
}

type OsmyntNodeKind = "team" | "membersRoot" | "member" | "recentRoot" | "action";

class OsmyntItem extends vscode.TreeItem {
	kind: OsmyntNodeKind;
	data?: any;
	constructor(kind: OsmyntNodeKind, label: string, collapsible: vscode.TreeItemCollapsibleState, data?: any) {
		super(label, collapsible);
		this.kind = kind;
		this.data = data;
		if (kind === "team") this.contextValue = "teamItem";
		if (kind === "member") this.contextValue = "memberItem";
	}
}

class OsmyntTreeProvider implements vscode.TreeDataProvider<OsmyntItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

	private cachedTeams: any[] = [];
	private cachedMembersByTeam: Record<string, any[]> = {};
	private cachedRecentByTeam: Record<string, any[]> = {};
	private cachedDmByUserId: Record<string, any[]> = {};

	constructor(private readonly context: vscode.ExtensionContext) {}

	getTreeItem(element: OsmyntItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: OsmyntItem): Promise<OsmyntItem[]> {
		try {
			// Root
			if (!element) {
				await this.ensureTeams();
				if (!Array.isArray(this.cachedTeams) || this.cachedTeams.length === 0) {
					return [new OsmyntItem("action", "Sign in to view team", vscode.TreeItemCollapsibleState.None)];
				}
				return this.cachedTeams.map(
					t => new OsmyntItem("team", `Team: ${t.name}`, vscode.TreeItemCollapsibleState.Expanded, t)
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
					{ teamId }
				);
				const recentRoot = new OsmyntItem(
					"recentRoot",
					unread > 0 ? `Recent Snippets (${unread} new)` : "Recent Snippets",
					vscode.TreeItemCollapsibleState.Collapsed,
					{ teamId }
				);
				// const actionsRoot = new OsmyntItem("actionsRoot", "Actions", vscode.TreeItemCollapsibleState.Collapsed);
				return [
					membersRoot,
					recentRoot,
					// actionsRoot
				];
			}

			// Children of members root
			if (element.kind === "membersRoot") {
				const teamId = element.data?.teamId as string;
				const list = this.cachedMembersByTeam[teamId] ?? [];
				return list.map(m => {
					const item = new OsmyntItem(
						"member",
						m.name || m.email,
						vscode.TreeItemCollapsibleState.Collapsed,
						{ ...m, teamId }
					);
					item.description = m.email;
					return item;
				});
			}
			// Children of member node → show DM recents with that member
			if (element.kind === "member") {
				const teamId = element.data?.teamId as string;
				const authorId = element.data?.id as string;
				const node = new OsmyntItem(
					"recentRoot",
					`Recents for ${element.label}`,
					vscode.TreeItemCollapsibleState.Collapsed,
					{ teamId, authorId, dmUserId: authorId }
				);
				return [node];
			}

			// Children of recent root
			if (element.kind === "recentRoot") {
				const dmUserId = element.data?.dmUserId as string | undefined;
				if (dmUserId) {
					await this.ensureDm(dmUserId);
					const dms = this.cachedDmByUserId[dmUserId] ?? [];
					return dms.map(s => {
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
					return item;
				});
			}

			// // Children of actions root
			// if (element.kind === "actionsRoot") {
			// 	const refresh = new OsmyntItem("action", "$(refresh)", vscode.TreeItemCollapsibleState.None);
			// 	refresh.command = { command: "osmynt.refreshTeam", title: "$(refresh)" };
			// 	return [refresh];
			// }

			return [];
		} catch {
			return [];
		}
	}

	async ensureTeams() {
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access) {
			this.cachedTeams = [];
			this.cachedMembersByTeam = {};
			return;
		}
		const res = await fetch(`${base}/protected/teams/me`, { headers: { Authorization: `Bearer ${access}` } });
		const j = await res.json();
		if (!res.ok || !Array.isArray(j?.teams)) {
			this.cachedTeams = [];
			this.cachedMembersByTeam = {};
			return;
		}
		this.cachedTeams = j.teams ?? [];
		this.cachedMembersByTeam = j.membersByTeam ?? {};
	}

	private async ensureRecent(teamId: string, authorId?: string) {
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access || !teamId) {
			this.cachedRecentByTeam[teamId] = [];
			return;
		}
		const url = authorId
			? `${base}/protected/code-share/team/${encodeURIComponent(teamId)}/by-author/${encodeURIComponent(authorId)}`
			: `${base}/protected/code-share/team/list?teamId=${encodeURIComponent(teamId)}`;
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		this.cachedRecentByTeam[teamId] = Array.isArray(j.items) ? j.items : [];
		// update last seen and unread
		const latest = this.cachedRecentByTeam[teamId][0]?.createdAt as string | undefined;
		if (latest) {
			await this.setLastSeen(teamId, latest);
		}
	}

	private async ensureDm(otherUserId: string) {
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access || !otherUserId) {
			this.cachedDmByUserId[otherUserId] = [];
			return;
		}
		const res = await fetch(`${base}/protected/code-share/dm/with/${encodeURIComponent(otherUserId)}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
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

async function nativeSecureLogin(context: vscode.ExtensionContext, githubAccessToken: string) {
	const config = vscode.workspace.getConfiguration("osmynt");
	const base = (config.get<string>("engineBaseUrl") ?? "http://localhost:3000/osmynt-api-engine").replace(/\/$/, "");

	const nodeCrypto = await import("crypto");
	const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
	if (!subtle) throw new Error("WebCrypto Subtle API not available");
	const eph: any = await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
	const clientPublicKeyJwk = await subtle.exportKey("jwk", eph.publicKey);

	const res = await fetch(`${base}/auth/login-with-token`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ provider: "github", accessToken: githubAccessToken, handshake: { clientPublicKeyJwk } }),
	});

	if (!res.ok) {
		vscode.window.showErrorMessage(`Engine login failed (${res.status})`);
		throw new Error(`Engine login failed (${res.status})`);
	}
	const j = await res.json();

	const serverPub: any = await subtle.importKey(
		"jwk",
		j.serverPublicKeyJwk,
		{ name: "ECDH", namedCurve: "P-256" },
		true,
		[]
	);
	const aesKey = await subtle.deriveKey(
		{ name: "ECDH", public: serverPub },
		eph.privateKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["decrypt"]
	);

	const b64uToBytes = (s: string) => {
		const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
		return Uint8Array.from(Buffer.from(padded, "base64"));
	};
	const iv = b64uToBytes(j.payload.ivB64u);
	const ciphertext = b64uToBytes(j.payload.ciphertextB64u);
	const plaintext = await subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ciphertext);
	const tokens = JSON.parse(Buffer.from(new Uint8Array(plaintext)).toString("utf-8")).tokens;

	await context.secrets.store(ACCESS_SECRET_KEY, tokens.access);
	await context.secrets.store(REFRESH_SECRET_KEY, tokens.refresh);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", true);
	vscode.window.showInformationMessage("Osmynt: Logged in");
	try {
		await ensureDeviceKeys(context);
	} catch {}
}

async function ensureDeviceKeys(context: vscode.ExtensionContext) {
	const nodeCrypto = await import("crypto");
	const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
	if (!subtle) throw new Error("WebCrypto Subtle API not available");

	let deviceId = await context.secrets.get(DEVICE_ID_KEY);
	if (!deviceId) {
		deviceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		await context.secrets.store(DEVICE_ID_KEY, deviceId);
	}

	let encKeypairJwk = await context.secrets.get(ENC_KEYPAIR_JWK_KEY);
	if (!encKeypairJwk) {
		const kp: any = await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
			"deriveKey",
			"deriveBits",
		]);
		const pub = await subtle.exportKey("jwk", kp.publicKey);
		const priv = await subtle.exportKey("jwk", kp.privateKey);
		encKeypairJwk = JSON.stringify({ publicKeyJwk: pub, privateKeyJwk: priv });
		await context.secrets.store(ENC_KEYPAIR_JWK_KEY, encKeypairJwk);
		await registerDeviceKey(context, deviceId, pub);
	} else {
		try {
			const parsed = JSON.parse(encKeypairJwk);
			if (parsed?.publicKeyJwk) {
				await registerDeviceKey(context, deviceId, parsed.publicKeyJwk);
			}
		} catch {}
	}
	return { deviceId };
}

async function registerDeviceKey(context: vscode.ExtensionContext, deviceId: string, publicKeyJwk: any) {
	const config = vscode.workspace.getConfiguration("osmynt");
	const base = (config.get<string>("engineBaseUrl") ?? "http://localhost:3000/osmynt-api-engine").replace(/\/$/, "");
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");
	await fetch(`${base}/protected/keys/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
		body: JSON.stringify({ deviceId, encryptionPublicKeyJwk: publicKeyJwk, algorithm: "ECDH-P-256" }),
	});
}

type ShareTarget = { kind: "team"; teamId?: string } | { kind: "user"; userId: string };

async function shareSelectedCode(
	context: vscode.ExtensionContext,
	code: string,
	title: string | undefined,
	target: ShareTarget,
	extraMetadata?: Record<string, any>
) {
	const config = vscode.workspace.getConfiguration("osmynt");
	const base = (config.get<string>("engineBaseUrl") ?? "http://localhost:3000/osmynt-api-engine").replace(/\/$/, "");
	const teamKeyMode = config.get<boolean>("teamKeyMode") ?? false;
	const teamKeyNamespace = config.get<string>("teamKeyNamespace") ?? "default";
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");

	const nodeCrypto = await import("crypto");
	const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
	if (!subtle) throw new Error("WebCrypto Subtle API not available");

	const encKeypair = JSON.parse((await context.secrets.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
	if (!encKeypair?.privateKeyJwk || !encKeypair?.publicKeyJwk) throw new Error("Missing device keys");
	await subtle.importKey("jwk", encKeypair.privateKeyJwk, { name: "ECDH", namedCurve: "P-256" }, true, [
		"deriveKey",
		"deriveBits",
	]);

	let recipients: any[] = [];
	if (target.kind === "team") {
		const teamId = target.teamId ?? (await promptTeamId(context));
		if (!teamId) throw new Error("No team selected");
		const recipientsRes = await fetch(`${base}/protected/keys/team/${encodeURIComponent(teamId)}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await recipientsRes.json();
		recipients = Array.isArray(j?.recipients) ? j.recipients : [];
	} else {
		// Aggregate recipients across all teams then filter by userId
		const tmRes = await fetch(`${base}/protected/teams/me`, { headers: { Authorization: `Bearer ${access}` } });
		const tm = await tmRes.json();
		const teams: Array<{ id: string }> = Array.isArray(tm?.teams) ? tm.teams : [];
		let all: any[] = [];
		for (const t of teams) {
			const rRes = await fetch(`${base}/protected/keys/team/${encodeURIComponent(t.id)}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const rj = await rRes.json();
			const arr = Array.isArray(rj?.recipients) ? rj.recipients : [];
			all = all.concat(arr);
		}
		recipients = all.filter((r: any) => r.userId === (target as any).userId);
	}
	if (recipients.length === 0) throw new Error("No recipients");

	// Encrypt content with AES-GCM
	const iv = nodeCrypto.randomBytes(12);
	const cekRaw = nodeCrypto.randomBytes(32);
	const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, true, ["encrypt", "wrapKey"]);
	const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv }, cek, new TextEncoder().encode(code));

	const wrappedKeys: any[] = [];

	if (teamKeyMode) {
		const teamKeyStorageKey = `osmynt.teamKey.${teamKeyNamespace}`;
		let teamKeyRawB64 = await context.secrets.get(teamKeyStorageKey);
		if (!teamKeyRawB64) {
			teamKeyRawB64 = Buffer.from(nodeCrypto.randomBytes(32)).toString("base64");
			await context.secrets.store(teamKeyStorageKey, teamKeyRawB64);
		}
		const teamKeyRaw = Buffer.from(teamKeyRawB64, "base64");
		const teamKey = await subtle.importKey("raw", teamKeyRaw, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
		const wrapIv = nodeCrypto.randomBytes(12);
		const wrapped = await subtle.encrypt({ name: "AES-GCM", iv: wrapIv }, teamKey, cekRaw);
		const wrappedCekB64u = b64url(new Uint8Array(wrapped as ArrayBuffer));
		for (const r of recipients) {
			wrappedKeys.push({
				recipientUserId: r.userId,
				recipientDeviceId: r.deviceId,
				senderEphemeralPublicKeyJwk: encKeypair.publicKeyJwk,
				wrappedCekB64u,
				wrapIvB64u: b64url(new Uint8Array(wrapIv)),
			});
		}

		const eph = (await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
			"deriveKey",
			"deriveBits",
		])) as any;
		const ephPubJwk = await subtle.exportKey("jwk", eph.publicKey);
		for (const r of recipients) {
			const recipientPub = await subtle.importKey(
				"jwk",
				r.encryptionPublicKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				[]
			);
			const kek = await subtle.deriveKey(
				{ name: "ECDH", public: recipientPub },
				eph.privateKey,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt"]
			);
			const wrapIv2 = nodeCrypto.randomBytes(12);
			const wrapped2 = await subtle.encrypt({ name: "AES-GCM", iv: wrapIv2 }, kek, cekRaw);
			const wrappedCekB64u_2 = b64url(new Uint8Array(wrapped2 as ArrayBuffer));
			wrappedKeys.push({
				recipientUserId: r.userId,
				recipientDeviceId: r.deviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u: wrappedCekB64u_2,
				wrapIvB64u: b64url(new Uint8Array(wrapIv2)),
			});
		}
	} else {
		const eph = (await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
			"deriveKey",
			"deriveBits",
		])) as any;
		const ephPubJwk = await subtle.exportKey("jwk", eph.publicKey);
		for (const r of recipients) {
			const recipientPub = await subtle.importKey(
				"jwk",
				r.encryptionPublicKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				[]
			);
			const kek = await subtle.deriveKey(
				{ name: "ECDH", public: recipientPub },
				eph.privateKey,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt"]
			);
			const wrapIv2 = nodeCrypto.randomBytes(12);
			const wrapped = await subtle.encrypt({ name: "AES-GCM", iv: wrapIv2 }, kek, cekRaw);
			const wrappedCekB64u = b64url(new Uint8Array(wrapped as ArrayBuffer));
			wrappedKeys.push({
				recipientUserId: r.userId,
				recipientDeviceId: r.deviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u,
				wrapIvB64u: b64url(new Uint8Array(wrapIv2)),
			});
		}
	}

	const currentTeamId = target.kind === "team" ? (target.teamId ?? (await promptTeamId(context))) : undefined;

	const res = await fetch(`${base}/protected/code-share/share`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
		body: JSON.stringify({
			ciphertextB64u: b64url(new Uint8Array(ciphertext as ArrayBuffer)),
			ivB64u: b64url(new Uint8Array(iv)),
			wrappedKeys,
			metadata: { teamId: currentTeamId, title, ...extraMetadata },
		}),
	});
	if (!res.ok) throw new Error(`Share failed (${res.status})`);
}

function b64url(bytes: Uint8Array) {
	return Buffer.from(bytes).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function extractInviteToken(input: string): string | undefined {
	try {
		// If it's a URL with ?token= param
		if (input.includes("http")) {
			const u = new URL(input);
			const t = u.searchParams.get("token");
			if (t) return t;
			// Or path /invite/:token
			const parts = u.pathname.split("/").filter(Boolean);
			const idx = parts.findIndex(p => p === "invite");
			if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
		}
		return input.trim();
	} catch {
		return input.trim();
	}
}

async function getBaseAndAccess(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("osmynt");
	const base = (config.get<string>("engineBaseUrl") ?? "http://localhost:3000/osmynt-api-engine").replace(/\/$/, "");
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");
	return { base, access };
}

async function promptTeamId(context: vscode.ExtensionContext): Promise<string | undefined> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/protected/teams/me`, { headers: { Authorization: `Bearer ${access}` } });
		const j = await res.json();
		// Prefer owned team; fallback to first team
		const teams: Array<{ id: string; ownerId: string }> = Array.isArray(j?.teams) ? j.teams : [];
		const meOwned = teams.find(t => t.ownerId && j?.user?.id && t.ownerId === j.user.id)?.id;
		return (meOwned || teams[0]?.id) as string | undefined;
	} catch {
		return undefined;
	}
}

async function tryDecryptSnippet(context: vscode.ExtensionContext, j: any): Promise<string | null> {
	try {
		const nodeCrypto = await import("crypto");
		const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
		if (!subtle) return null;

		//FIRST TRY: Try per-recipient unwrap first so we don't fail early on team-key mismatch
		try {
			const encKeypair = JSON.parse((await context.secrets.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
			if (encKeypair?.privateKeyJwk) {
				const priv: any = await subtle.importKey(
					"jwk",
					encKeypair.privateKeyJwk,
					{ name: "ECDH", namedCurve: "P-256" },
					true,
					["deriveKey", "deriveBits"]
				);
				for (const wk of j.wrappedKeys ?? []) {
					if (!wk?.senderEphemeralPublicKeyJwk || !wk?.wrappedCekB64u || !wk?.wrapIvB64u) continue;
					try {
						const senderPub = await subtle.importKey(
							"jwk",
							wk.senderEphemeralPublicKeyJwk,
							{ name: "ECDH", namedCurve: "P-256" },
							true,
							[]
						);
						const kek = await subtle.deriveKey(
							{ name: "ECDH", public: senderPub },
							priv,
							{ name: "AES-GCM", length: 256 },
							false,
							["decrypt"]
						);
						const wrappedBytes = b64uToBytes(wk.wrappedCekB64u);
						const wrapIv = b64uToBytes(wk.wrapIvB64u);
						const cekRaw = await subtle.decrypt({ name: "AES-GCM", iv: wrapIv }, kek, wrappedBytes);
						const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, false, [
							"decrypt",
						]);
						const iv = b64uToBytes(j.ivB64u);
						const ciphertext = b64uToBytes(j.ciphertextB64u);
						const plaintext = await subtle.decrypt({ name: "AES-GCM", iv }, cek, ciphertext);
						return Buffer.from(new Uint8Array(plaintext)).toString("utf-8");
					} catch {
						// try next entry (unwrapping failed)
					}
				}
			}
		} catch {}

		//SECOND TRY (FALLBACK): team-key mode, but don't abort on failure
		try {
			const config = vscode.workspace.getConfiguration("osmynt");
			const teamKeyMode = config.get<boolean>("teamKeyMode") ?? false;
			if (teamKeyMode) {
				const teamKeyNamespace = config.get<string>("teamKeyNamespace") ?? "default";
				const teamKeyStorageKey = `osmynt.teamKey.${teamKeyNamespace}`;
				const teamKeyRawB64 = await context.secrets.get(teamKeyStorageKey);
				if (teamKeyRawB64) {
					const teamKeyRaw = Buffer.from(teamKeyRawB64, "base64");
					const teamKey = await subtle.importKey("raw", teamKeyRaw, { name: "AES-GCM", length: 256 }, false, [
						"decrypt",
					]);
					const wk = (j.wrappedKeys ?? [])[0];
					if (wk?.wrappedCekB64u && wk?.wrapIvB64u) {
						const wrappedBytes = b64uToBytes(wk.wrappedCekB64u);
						const wrapIv = b64uToBytes(wk.wrapIvB64u);
						const cekRaw = await subtle.decrypt({ name: "AES-GCM", iv: wrapIv }, teamKey, wrappedBytes);
						const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, false, [
							"decrypt",
						]);
						const iv = b64uToBytes(j.ivB64u);
						const ciphertext = b64uToBytes(j.ciphertextB64u);
						const plaintext = await subtle.decrypt({ name: "AES-GCM", iv }, cek, ciphertext);
						return Buffer.from(new Uint8Array(plaintext)).toString("utf-8");
					}
				}
			}
		} catch {}

		return null;
	} catch {
		return null;
	}
}

function b64uToBytes(s: string) {
	const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
	return Uint8Array.from(Buffer.from(padded, "base64"));
}

async function pickShareTarget(context: vscode.ExtensionContext): Promise<ShareTarget> {
	const { base, access } = await getBaseAndAccess(context);
	const res = await fetch(`${base}/protected/teams/me`, { headers: { Authorization: `Bearer ${access}` } });
	const j = await res.json();
	const teams: Array<{ id: string; name: string }> = Array.isArray(j?.teams) ? j.teams : [];
	const membersByTeam: Record<string, any[]> = j?.membersByTeam ?? {};
	const uniqueMembers: Record<string, { label: string; description: string; userId: string }> = {};
	for (const tid of Object.keys(membersByTeam)) {
		for (const m of membersByTeam[tid] ?? []) {
			if (!uniqueMembers[m.id])
				uniqueMembers[m.id] = { label: m.name || m.email, description: m.email, userId: m.id };
		}
	}
	const items: (vscode.QuickPickItem & { _kind?: "team" | "user"; userId?: string; teamId?: string })[] = [
		...teams.map(t => ({
			label: `Share with Team: ${t.name}`,
			description: t.id,
			_kind: "team" as "team",
			teamId: t.id,
		})),
		...Object.values(uniqueMembers).map(m => ({
			label: `Share with ${m.label}`,
			description: m.description,
			_kind: "user" as "user",
			userId: m.userId,
		})),
	];
	const choice = await vscode.window.showQuickPick(items, { placeHolder: "Select team or user to share" });
	if (!choice) return { kind: "team" };
	if (choice._kind === "team") return { kind: "team", teamId: (choice as any).teamId } as any;
	return { kind: "user", userId: choice.userId! } as ShareTarget;
}
