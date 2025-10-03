import * as vscode from "vscode";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, DEVICE_ID_KEY, ENC_KEYPAIR_JWK_KEY } from "@/constants/constants";
import { b64uToBytes, b64url } from "@/utils/osmynt.utils";

type ShareTarget = { kind: "team"; teamId?: string } | { kind: "user"; userId: string };

export async function nativeSecureLogin(context: vscode.ExtensionContext, githubAccessToken: string) {
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

export async function ensureDeviceKeys(context: vscode.ExtensionContext) {
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

export async function registerDeviceKey(context: vscode.ExtensionContext, deviceId: string, publicKeyJwk: any) {
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

export async function getBaseAndAccess(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("osmynt");
	const base = (config.get<string>("engineBaseUrl") ?? "http://localhost:3000/osmynt-api-engine").replace(/\/$/, "");
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");
	return { base, access };
}

export async function promptTeamId(context: vscode.ExtensionContext): Promise<string | undefined> {
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

export async function tryDecryptSnippet(context: vscode.ExtensionContext, j: any): Promise<string | null> {
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

export async function pickShareTarget(context: vscode.ExtensionContext): Promise<ShareTarget> {
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

export async function shareSelectedCode(
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
