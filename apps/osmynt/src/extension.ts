import * as vscode from "vscode";

const ACCESS_SECRET_KEY = "osmynt.accessToken";
const REFRESH_SECRET_KEY = "osmynt.refreshToken";

export async function activate(context: vscode.ExtensionContext) {
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
			vscode.window.showInformationMessage(`Selected ${selected.length} chars to share.`);
		})
	);

	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", Boolean(access));
}

export function deactivate() {}

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
