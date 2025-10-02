import * as vscode from "vscode";

const ACCESS_SECRET_KEY = "osmynt.accessToken";
const REFRESH_SECRET_KEY = "osmynt.refreshToken";
const DEVICE_ID_KEY = "osmynt.deviceId";
const ENC_KEYPAIR_JWK_KEY = "osmynt.encKeypair.jwk";
const SIGN_KEYPAIR_JWK_KEY = "osmynt.signKeypair.jwk";

export async function activate(context: vscode.ExtensionContext) {
	// Register a basic TreeDataProvider to make the activity bar view render
	const tree = new OsmyntTreeProvider(context);
	context.subscriptions.push(vscode.window.registerTreeDataProvider("osmyntView", tree));

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.login", async () => {
			try {
				const session = await vscode.authentication.getSession("github", ["read:user", "user:email"], {
					createIfNone: true,
				});
				if (!session) {
					vscode.window.showErrorMessage("GitHub authentication failed.");
					return;
				}
				await nativeSecureLogin(context, session.accessToken);
				tree.refresh();
			} catch (e) {
				vscode.window.showErrorMessage(`Login failed: ${e}`);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.logout", async () => {
			await context.secrets.delete(ACCESS_SECRET_KEY);
			await context.secrets.delete(REFRESH_SECRET_KEY);
			await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", false);
			vscode.window.showInformationMessage("Logged out of Osmynt.");

			tree.refresh();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.shareCode", async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor || editor.selection.isEmpty) {
				vscode.window.showWarningMessage("Select some code to share.");
				return;
			}
			const selected = editor.document.getText(editor.selection);
			const title = await vscode.window.showInputBox({ prompt: "Snippet title (optional)" });
			try {
				await ensureDeviceKeys(context);
				await shareSelectedCode(context, selected, title);
				vscode.window.showInformationMessage("Osmynt: Snippet shared securely");
			} catch (e) {
				vscode.window.showErrorMessage(`Share failed: ${e}`);
			}
		})
	);

	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", Boolean(access));
}

export function deactivate() {}

type OsmyntNodeKind = "team" | "membersRoot" | "member" | "actionsRoot" | "action";

class OsmyntItem extends vscode.TreeItem {
	kind: OsmyntNodeKind;
	data?: any;
	constructor(kind: OsmyntNodeKind, label: string, collapsible: vscode.TreeItemCollapsibleState, data?: any) {
		super(label, collapsible);
		this.kind = kind;
		this.data = data;
	}
}

class OsmyntTreeProvider implements vscode.TreeDataProvider<OsmyntItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

	private cachedTeam: any | null = null;
	private cachedMembers: any[] = [];
	private cachedRecent: any[] = [];

	constructor(private readonly context: vscode.ExtensionContext) {}

	getTreeItem(element: OsmyntItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: OsmyntItem): Promise<OsmyntItem[]> {
		try {
			// Root
			if (!element) {
				await this.ensureTeam();
				if (!this.cachedTeam) {
					return [new OsmyntItem("action", "Sign in to view team", vscode.TreeItemCollapsibleState.None)];
				}
				const team = new OsmyntItem(
					"team",
					`Team: ${this.cachedTeam.name}`,
					vscode.TreeItemCollapsibleState.Expanded,
					this.cachedTeam
				);
				return [team];
			}

			// Children of team
			if (element.kind === "team") {
				const membersRoot = new OsmyntItem(
					"membersRoot",
					`Members (${this.cachedMembers.length})`,
					vscode.TreeItemCollapsibleState.Collapsed
				);
				const recentRoot = new OsmyntItem(
					"actionsRoot",
					"Recent Snippets",
					vscode.TreeItemCollapsibleState.Collapsed
				);
				const actionsRoot = new OsmyntItem("actionsRoot", "Actions", vscode.TreeItemCollapsibleState.Collapsed);
				return [membersRoot, recentRoot, actionsRoot];
			}

			// Children of members root
			if (element.kind === "membersRoot") {
				return this.cachedMembers.map(m => {
					const item = new OsmyntItem("member", m.name || m.email, vscode.TreeItemCollapsibleState.None, m);
					item.description = m.email;
					return item;
				});
			}

			// Children of recent root (reuse kind)
			if (element.label === "Recent Snippets") {
				await this.ensureRecent();
				return this.cachedRecent.map(s => {
					const label = s.metadata?.title ? `${s.metadata.title}` : `Snippet ${s.id.slice(0, 6)}`;
					const item = new OsmyntItem("action", label, vscode.TreeItemCollapsibleState.None, s);
					item.command = { command: "osmynt.viewSnippet", title: "View Snippet", arguments: [s.id] };
					item.description = new Date(s.createdAt).toLocaleString();
					return item;
				});
			}

			// Children of actions root
			if (element.kind === "actionsRoot") {
				const refresh = new OsmyntItem("action", "Refresh Team", vscode.TreeItemCollapsibleState.None);
				refresh.command = { command: "osmynt.refreshTeam", title: "Refresh Team" };
				return [refresh];
			}

			return [];
		} catch {
			return [new OsmyntItem("action", "Sign in to view team", vscode.TreeItemCollapsibleState.None)];
		}
	}

	async ensureTeam() {
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access) {
			this.cachedTeam = null;
			this.cachedMembers = [];
			return;
		}
		const res = await fetch(`${base}/protected/teams/me`, { headers: { Authorization: `Bearer ${access}` } });
		const j = await res.json();
		if (!res.ok || !j?.team) {
			this.cachedTeam = null;
			this.cachedMembers = [];
			return;
		}
		this.cachedTeam = j.team;
		this.cachedMembers = Array.isArray(j.members) ? j.members : [];
	}

	private async ensureRecent() {
		const { base, access } = await getBaseAndAccess(this.context).catch(() => ({ base: "", access: "" }));
		if (!base || !access) {
			this.cachedRecent = [];
			return;
		}
		const res = await fetch(`${base}/protected/code-share/team/list`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		this.cachedRecent = Array.isArray(j.items) ? j.items : [];
	}

	refresh() {
		// clear cache and notify
		this.cachedTeam = null;
		this.cachedMembers = [];
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

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.inviteMember", async () => {
			try {
				const teamId = await promptTeamId(context);
				if (!teamId) return;
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
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.acceptInvitation", async () => {
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
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.refreshTeam", async () => {
			// trigger tree data reload
			await vscode.commands.executeCommand("workbench.view.extension.osmynt");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.viewSnippet", async (id?: string) => {
			try {
				const { base, access } = await getBaseAndAccess(context);
				const snippetId = id ?? (await vscode.window.showInputBox({ prompt: "Enter snippet id" }));
				if (!snippetId) return;
				const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(snippetId)}`, {
					headers: { Authorization: `Bearer ${access}` },
				});
				const j = await res.json();
				if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
				// NOTE: decryption path to be wired next; show header for now
				const doc = await vscode.workspace.openTextDocument({
					language: "markdown",
					content: `# ${j?.metadata?.title ?? "Snippet"}\n\nID: ${j.id}\nAuthor: ${j.authorId}\nCreated: ${j.createdAt}`,
				});
				await vscode.window.showTextDocument(doc, { preview: false });
			} catch (e) {
				vscode.window.showErrorMessage(`Open failed: ${e}`);
			}
		})
	);
	if (!res.ok) throw new Error(`Engine login failed (${res.status})`);
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

async function shareSelectedCode(context: vscode.ExtensionContext, code: string, title?: string | undefined) {
	const config = vscode.workspace.getConfiguration("osmynt");
	const base = (config.get<string>("engineBaseUrl") ?? "http://localhost:3000/osmynt-api-engine").replace(/\/$/, "");
	const teamKeyMode = config.get<boolean>("teamKeyMode") ?? false;
	const teamKeyNamespace = config.get<string>("teamKeyNamespace") ?? "default";
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");

	const nodeCrypto = await import("crypto");
	const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
	if (!subtle) throw new Error("WebCrypto Subtle API not available");

	// Load our device key
	const encKeypair = JSON.parse((await context.secrets.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
	if (!encKeypair?.privateKeyJwk || !encKeypair?.publicKeyJwk) throw new Error("Missing device keys");
	const myPriv: any = await subtle.importKey(
		"jwk",
		encKeypair.privateKeyJwk,
		{ name: "ECDH", namedCurve: "P-256" },
		true,
		["deriveKey", "deriveBits"]
	);

	// Fetch recipients
	const recipientsRes = await fetch(`${base}/protected/keys/team/default`, {
		headers: { Authorization: `Bearer ${access}` },
	});
	const { recipients } = await recipientsRes.json();
	if (!Array.isArray(recipients) || recipients.length === 0) throw new Error("No recipients");

	// Encrypt content with AES-GCM
	const iv = nodeCrypto.randomBytes(12);
	const cekRaw = nodeCrypto.randomBytes(32);
	const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, true, ["encrypt", "wrapKey"]);
	const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv }, cek, new TextEncoder().encode(code));

	const wrappedKeys: any[] = [];

	if (teamKeyMode) {
		// Team key mode: KEK for team; wrap CEK once; deliver to everyone sharing same team key
		const teamKeyStorageKey = `osmynt.teamKey.${teamKeyNamespace}`;
		let teamKeyRawB64 = await context.secrets.get(teamKeyStorageKey);
		if (!teamKeyRawB64) {
			teamKeyRawB64 = Buffer.from(nodeCrypto.randomBytes(32)).toString("base64");
			await context.secrets.store(teamKeyStorageKey, teamKeyRawB64);
		}
		const teamKeyRaw = Buffer.from(teamKeyRawB64, "base64");
		const teamKey = await subtle.importKey("raw", teamKeyRaw, { name: "AES-GCM", length: 256 }, true, ["wrapKey"]);
		const wrapIv = nodeCrypto.randomBytes(12);
		const wrapped = await subtle.wrapKey("raw", cek, teamKey, { name: "AES-GCM", iv: wrapIv });
		const wrappedCekB64u = b64url(new Uint8Array(wrapped as ArrayBuffer));
		for (const r of recipients) {
			wrappedKeys.push({
				recipientUserId: r.userId,
				recipientDeviceId: r.deviceId,
				senderEphemeralPublicKeyJwk: encKeypair.publicKeyJwk,
				wrappedCekB64u,
			});
		}
	} else {
		// Per-recipient wrap using ephemeral ECDH
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
				["wrapKey"]
			);
			const wrapIv2 = nodeCrypto.randomBytes(12);
			const wrapped = await subtle.wrapKey("raw", cek, kek, { name: "AES-GCM", iv: wrapIv2 });
			const wrappedCekB64u = b64url(new Uint8Array(wrapped as ArrayBuffer));
			wrappedKeys.push({
				recipientUserId: r.userId,
				recipientDeviceId: r.deviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u,
			});
		}
	}

	const res = await fetch(`${base}/protected/code-share/share`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
		body: JSON.stringify({
			ciphertextB64u: b64url(new Uint8Array(ciphertext as ArrayBuffer)),
			ivB64u: b64url(new Uint8Array(iv)),
			wrappedKeys,
			metadata: { teamId: "default", title },
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
		return j?.team?.id as string | undefined;
	} catch {
		return undefined;
	}
}
