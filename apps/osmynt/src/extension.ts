import * as vscode from "vscode";

const ACCESS_SECRET_KEY = "osmynt.accessToken";
const REFRESH_SECRET_KEY = "osmynt.refreshToken";
const DEVICE_ID_KEY = "osmynt.deviceId";
const ENC_KEYPAIR_JWK_KEY = "osmynt.encKeypair.jwk";
const SIGN_KEYPAIR_JWK_KEY = "osmynt.signKeypair.jwk";

export async function activate(context: vscode.ExtensionContext) {
	// Register a basic TreeDataProvider to make the activity bar view render
	const tree = new OsmyntTreeProvider();
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
			try {
				await ensureDeviceKeys(context);
				await shareSelectedCode(context, selected);
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

class OsmyntTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}
	getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {
		return [
			new vscode.TreeItem("Login", vscode.TreeItemCollapsibleState.None),
			new vscode.TreeItem("Share code", vscode.TreeItemCollapsibleState.None),
		];
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
		const kp: any = await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
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

async function shareSelectedCode(context: vscode.ExtensionContext, code: string) {
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
	const myPriv: any = await subtle.importKey("jwk", encKeypair.privateKeyJwk, { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);

	// Fetch recipients
	const recipientsRes = await fetch(`${base}/protected/keys/team/default`, { headers: { Authorization: `Bearer ${access}` } });
	const { recipients } = await recipientsRes.json();
	if (!Array.isArray(recipients) || recipients.length === 0) throw new Error("No recipients");

	// Encrypt content with AES-GCM
	const iv = nodeCrypto.randomBytes(12);
	const cekRaw = nodeCrypto.randomBytes(32);
	const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
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
		const wrapped = await subtle.wrapKey("raw", cek, teamKey, { name: "AES-GCM", iv });
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
		const eph = (await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"])) as any;
		const ephPubJwk = await subtle.exportKey("jwk", eph.publicKey);
		for (const r of recipients) {
			const recipientPub = await subtle.importKey("jwk", r.encryptionPublicKeyJwk, { name: "ECDH", namedCurve: "P-256" }, true, []);
			const kek = await subtle.deriveKey({ name: "ECDH", public: recipientPub }, eph.privateKey, { name: "AES-GCM", length: 256 }, false, ["wrapKey"]);
			const wrapped = await subtle.wrapKey("raw", cek, kek, { name: "AES-GCM", iv });
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
			metadata: { teamId: "default" },
		}),
	});
	if (!res.ok) throw new Error(`Share failed (${res.status})`);
}

function b64url(bytes: Uint8Array) {
	return Buffer.from(bytes)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}
