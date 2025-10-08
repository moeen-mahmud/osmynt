import * as vscode from "vscode";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, DEVICE_ID_KEY, ENC_KEYPAIR_JWK_KEY } from "@/constants/osmynt.constant";
import { b64uToBytes, b64url } from "@/utils/osmynt.utils";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import type { ShareTarget } from "@/types/osmynt.types";

export async function nativeSecureLogin(context: vscode.ExtensionContext, githubAccessToken: string) {
	const base = ENDPOINTS.engineBaseUrl?.replace(/\/$/, "");

	const nodeCrypto = await import("crypto");
	const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;

	if (!subtle) throw new Error("WebCrypto Subtle API not available");

	const eph: any = await subtle.generateKey(
		{
			name: "ECDH",
			namedCurve: "P-256",
		},
		true,
		["deriveKey", "deriveBits"]
	);

	const clientPublicKeyJwk = await subtle.exportKey("jwk", eph.publicKey);

	const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.auth.loginWithToken}`, {
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
	const base = ENDPOINTS.engineBaseUrl!.replace(/\/$/, "");
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");
	await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.register}`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
		body: JSON.stringify({ deviceId, encryptionPublicKeyJwk: publicKeyJwk, algorithm: "ECDH-P-256" }),
	});
}

export async function initiateDevicePairing(context: vscode.ExtensionContext): Promise<string | null> {
	try {
		const nodeCrypto = await import("crypto");
		const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
		if (!subtle) throw new Error("WebCrypto Subtle API not available");
		const { base, access } = await getBaseAndAccess(context);
		// Pack current device's public key for transfer
		const encKeypair = JSON.parse((await context.secrets.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
		if (!encKeypair?.publicKeyJwk) throw new Error("Missing device public key");
		const payload = JSON.stringify({ publicKeyJwk: encKeypair.publicKeyJwk });
		const iv = (await import("crypto")).randomBytes(12);
		// For pairing bootstrap, encrypt payload with a random symmetric key shown only on screen
		const pairingKey = (await import("crypto")).randomBytes(32);
		const key = await subtle.importKey("raw", pairingKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
		const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv }, key, Buffer.from(payload, "utf-8"));
		const deviceId = (await context.secrets.get(DEVICE_ID_KEY))!;
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.pairingInit}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
			body: JSON.stringify({
				deviceId,
				ivB64u: b64url(new Uint8Array(iv)),
				ciphertextB64u: b64url(new Uint8Array(ciphertext as ArrayBuffer)),
			}),
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		const token = j?.token as string;
		// Show both token and pairingKey to user to transfer
		const pairingKeyB64 = Buffer.from(pairingKey).toString("base64");
		await vscode.env.clipboard.writeText(`${token}#${pairingKeyB64}`);
		vscode.window.showInformationMessage("Pairing code (token#key) copied. Paste on companion device.");
		return `${token}#${pairingKeyB64}`;
	} catch (e) {
		vscode.window.showErrorMessage(`Pairing init failed: ${e}`);
		return null;
	}
}

export async function claimDevicePairing(context: vscode.ExtensionContext): Promise<boolean> {
	try {
		const raw = await vscode.window.showInputBox({
			prompt: "Paste pairing code from primary device (token#base64key)",
		});
		if (!raw) return false;
		const [token, keyB64] = raw.split("#");
		if (!token || !keyB64) throw new Error("Invalid pairing code format");
		const pairingKey = Buffer.from(keyB64, "base64");
		const nodeCrypto = await import("crypto");
		const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
		if (!subtle) throw new Error("WebCrypto Subtle API not available");
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.pairingClaim}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
			body: JSON.stringify({ token }),
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		const iv = b64uToBytes(j.ivB64u);
		const ciphertext = b64uToBytes(j.ciphertextB64u);
		const key = await subtle.importKey("raw", pairingKey, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
		const plaintext = await subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
		const msg = JSON.parse(Buffer.from(new Uint8Array(plaintext)).toString("utf-8"));
		const publicKeyJwk = msg?.publicKeyJwk;
		if (!publicKeyJwk) throw new Error("Invalid payload");
		// Generate own private key and register with backend
		const kp: any = await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
			"deriveKey",
			"deriveBits",
		]);
		const myPub = await subtle.exportKey("jwk", kp.publicKey);
		const myPriv = await subtle.exportKey("jwk", kp.privateKey);
		await context.secrets.store(
			ENC_KEYPAIR_JWK_KEY,
			JSON.stringify({ publicKeyJwk: myPub, privateKeyJwk: myPriv })
		);
		let deviceId = await context.secrets.get(DEVICE_ID_KEY);
		if (!deviceId) {
			deviceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			await context.secrets.store(DEVICE_ID_KEY, deviceId);
		}
		await registerDeviceKey(context, deviceId!, myPub);
		vscode.window.showInformationMessage("Device paired successfully");
		return true;
	} catch (e) {
		vscode.window.showErrorMessage(`Pairing claim failed: ${e}`);
		return false;
	}
}

export async function removeDevice(context: vscode.ExtensionContext): Promise<void> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const deviceId = await vscode.window.showInputBox({ prompt: "Enter deviceId to remove" });
		if (!deviceId) return;
		const res = await fetch(
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.deviceRemove(encodeURIComponent(deviceId))}`,
			{
				method: "DELETE",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const j = await res.json();
		if (!res.ok || !j?.ok) throw new Error(j?.error || `Failed (${res.status})`);
		vscode.window.showInformationMessage("Device removed");
	} catch (e) {
		vscode.window.showErrorMessage(`Remove device failed: ${e}`);
	}
}

export async function backfillAccessForCompanion(context: vscode.ExtensionContext): Promise<void> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		// determine companion device id
		const meRes = await fetch(`${base}/${ENDPOINTS.base}/protected/keys/me`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const me = await meRes.json();
		const devices: Array<{ deviceId: string; encryptionPublicKeyJwk: any; isPrimary?: boolean }> = Array.isArray(
			me?.devices
		)
			? me.devices
			: [];
		if (devices.length < 2) {
			vscode.window.showInformationMessage("No companion device found.");
			return;
		}
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		const companion = devices.find(d => d.deviceId !== localId) || devices[1];
		const meIsPrimary = (devices.find(d => d.deviceId === localId)?.isPrimary ?? false) || devices.length === 1;
		if (!meIsPrimary) {
			vscode.window.showWarningMessage("Run backfill from the primary device.");
			return;
		}
		if (!companion) {
			vscode.window.showWarningMessage("Companion device not found.");
			return;
		}

		// fetch recent team items as a starter (can be expanded to DMs, etc.)
		const teamId = await promptTeamId(context);
		if (!teamId) {
			vscode.window.showWarningMessage("No team available to backfill.");
			return;
		}
		const listRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.listTeam}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const list = await listRes.json();
		const items: Array<{ id: string; wrappedKeys?: any[] }> = Array.isArray(list?.items) ? list.items : [];

		const nodeCrypto = await import("crypto");
		const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
		if (!subtle) throw new Error("WebCrypto Subtle API not available");

		// load our device keypair
		const encKeypair = JSON.parse((await context.secrets.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
		if (!encKeypair?.privateKeyJwk || !encKeypair?.publicKeyJwk) {
			vscode.window.showWarningMessage("Missing device keys.");
			return;
		}
		const myPriv: any = await subtle.importKey(
			"jwk",
			encKeypair.privateKeyJwk,
			{ name: "ECDH", namedCurve: "P-256" },
			true,
			["deriveKey", "deriveBits"]
		);

		const companionPub = await subtle.importKey(
			"jwk",
			companion.encryptionPublicKeyJwk,
			{ name: "ECDH", namedCurve: "P-256" },
			true,
			[]
		);

		// iterate and add a wrapped key for companion device per item where not already present
		for (const it of items) {
			try {
				// fetch full item to get ciphertext iv and existing wraps
				const itemRes = await fetch(
					`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(it.id))}`,
					{
						headers: { Authorization: `Bearer ${access}` },
					}
				);
				const full = await itemRes.json();
				if (!itemRes.ok) continue;
				const already = (full?.wrappedKeys ?? []).some(
					(wk: any) => wk?.recipientDeviceId === companion.deviceId
				);
				if (already) continue;

				// We need the CEK; since server stores only ciphertext, we cannot decrypt without sender-side CEK.
				// Strategy: require that this device authored the snippet OR stored CEK in memory. For v1, only backfill when authored by me.
				const meTeamsRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
					headers: { Authorization: `Bearer ${access}` },
				});
				const meTeams = await meTeamsRes.json();
				const meUserId: string | undefined = meTeams?.user?.id;
				if (!meUserId || full?.authorId !== meUserId) continue;

				// Derive CEK: try local ECDH unwrap first; then fall back to team-key unwrap if enabled
				let cekRaw: ArrayBuffer | null = null;
				for (const wk of full?.wrappedKeys ?? []) {
					if (wk?.recipientDeviceId === (localId as string)) {
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
								myPriv,
								{ name: "AES-GCM", length: 256 },
								false,
								["decrypt"]
							);
							const wrapIv = b64uToBytes(wk.wrapIvB64u);
							const wrappedBytes = b64uToBytes(wk.wrappedCekB64u);
							cekRaw = await subtle.decrypt({ name: "AES-GCM", iv: wrapIv }, kek, wrappedBytes);
							break;
						} catch {}
					}
				}
				// Fallback: team-key unwrap (only for team snippets and if team key is configured)
				if (!cekRaw && full?.metadata?.teamId) {
					const config = vscode.workspace.getConfiguration("osmynt");
					const teamKeyMode = config.get<boolean>("teamKeyMode") ?? false;
					if (teamKeyMode) {
						const teamKeyNamespace = config.get<string>("teamKeyNamespace") ?? "default";
						const teamKeyStorageKey = `osmynt.teamKey.${teamKeyNamespace}`;
						const teamKeyRawB64 = await context.secrets.get(teamKeyStorageKey);
						if (teamKeyRawB64) {
							try {
								const teamKeyRaw = Buffer.from(teamKeyRawB64, "base64");
								const teamKey = await subtle.importKey(
									"raw",
									teamKeyRaw,
									{ name: "AES-GCM", length: 256 },
									false,
									["decrypt"]
								);
								const wk0 = (full?.wrappedKeys ?? [])[0];
								if (wk0?.wrappedCekB64u && wk0?.wrapIvB64u) {
									const wrappedBytes = b64uToBytes(wk0.wrappedCekB64u);
									const wrapIv = b64uToBytes(wk0.wrapIvB64u);
									cekRaw = await subtle.decrypt(
										{ name: "AES-GCM", iv: wrapIv },
										teamKey,
										wrappedBytes
									);
								}
							} catch {}
						}
					}
				}
				if (!cekRaw) continue;

				// Wrap CEK for companion
				const eph = (await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
					"deriveKey",
					"deriveBits",
				])) as any;
				const ephPubJwk = await subtle.exportKey("jwk", eph.publicKey);
				const kek2 = await subtle.deriveKey(
					{ name: "ECDH", public: companionPub },
					eph.privateKey,
					{ name: "AES-GCM", length: 256 },
					false,
					["encrypt"]
				);
				const wrapIv2 = (await import("crypto")).randomBytes(12);
				const wrapped2 = await subtle.encrypt({ name: "AES-GCM", iv: wrapIv2 }, kek2, cekRaw);
				const payload = {
					wrappedKeys: [
						{
							recipientUserId: meUserId,
							recipientDeviceId: companion.deviceId,
							senderEphemeralPublicKeyJwk: ephPubJwk,
							wrappedCekB64u: b64url(new Uint8Array(wrapped2 as ArrayBuffer)),
							wrapIvB64u: b64url(new Uint8Array(wrapIv2)),
						},
					],
				};
				await fetch(
					`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.addWrappedKeys(encodeURIComponent(full.id))}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
						body: JSON.stringify(payload),
					}
				);
			} catch {}
		}
		vscode.window.showInformationMessage("Backfill completed for companion device (authored items).");
	} catch (e) {
		vscode.window.showErrorMessage(`Backfill failed: ${e}`);
	}
}

export async function getBaseAndAccess(context: vscode.ExtensionContext) {
	const base = ENDPOINTS.engineBaseUrl!.replace(/\/$/, "");
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	if (!access) throw new Error("Not logged in");
	return { base, access };
}

export async function computeAndSetDeviceContexts(context: vscode.ExtensionContext) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/${ENDPOINTS.base}/protected/keys/me`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		const devices: Array<{ deviceId: string; createdAt?: string; isPrimary?: boolean }> = Array.isArray(j?.devices)
			? j.devices
			: [];
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		const local = devices.find(d => d.deviceId === localId);
		const hasPrimary = devices.some(d => d.isPrimary);
		const deviceCount = devices.length;

		const isPrimary = Boolean(local && (local.isPrimary || (!hasPrimary && deviceCount <= 1)));
		const isCompanion = Boolean(local && !local.isPrimary && deviceCount >= 1);
		const hasCompanion = deviceCount >= 2;

		await vscode.commands.executeCommand("setContext", "osmynt.isPrimaryDevice", isPrimary);
		await vscode.commands.executeCommand("setContext", "osmynt.isCompanionDevice", isCompanion);
		await vscode.commands.executeCommand("setContext", "osmynt.canGeneratePairing", isPrimary && !hasCompanion);
		await vscode.commands.executeCommand("setContext", "osmynt.canPastePairing", isCompanion);
	} catch {
		// leave defaults
	}
}

export async function promptTeamId(context: vscode.ExtensionContext): Promise<string | undefined> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
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

		//SECOND TRY (FALLBACK): team-key mode, but only for team snippets (require teamId)
		try {
			const config = vscode.workspace.getConfiguration("osmynt");
			const teamKeyMode = config.get<boolean>("teamKeyMode") ?? false;
			if (teamKeyMode && (j?.metadata?.teamId as string | undefined)) {
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
	const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
		headers: { Authorization: `Bearer ${access}` },
	});
	const j = await res.json();
	const teams: Array<{ id: string; name: string }> = Array.isArray(j?.teams) ? j.teams : [];
	const membersByTeam: Record<string, any[]> = j?.membersByTeam ?? {};
	const currentUserId: string | undefined = j?.user?.id as string | undefined;
	const uniqueMembers: Record<string, { label: string; description: string; userId: string }> = {};
	for (const tid of Object.keys(membersByTeam)) {
		for (const m of membersByTeam[tid] ?? []) {
			if (m.id === currentUserId) continue; // remove self from DM options
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
	const base = ENDPOINTS.engineBaseUrl!.replace(/\/$/, "");
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
	let meUserId: string | undefined;
	if (target.kind === "team") {
		const teamId = target.teamId ?? (await promptTeamId(context));
		if (!teamId) throw new Error("No team selected");
		const recipientsRes = await fetch(
			// `${base}/protected/keys/team/${encodeURIComponent(teamId)}`,
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.teamById(encodeURIComponent(teamId))}`,
			{
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const j = await recipientsRes.json();
		recipients = Array.isArray(j?.recipients) ? j.recipients : [];
		// get current user id for self-wrapping
		try {
			const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const me = await meRes.json();
			meUserId = me?.user?.id as string | undefined;
		} catch {}
	} else {
		// Aggregate recipients across all teams then filter by userId
		const tmRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const tm = await tmRes.json();
		const teams: Array<{ id: string }> = Array.isArray(tm?.teams) ? tm.teams : [];
		let all: any[] = [];
		for (const t of teams) {
			const rRes = await fetch(
				// `${base}/protected/keys/team/${encodeURIComponent(t.id)}`,
				`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.teamById(encodeURIComponent(t.id))}`,
				{
					headers: { Authorization: `Bearer ${access}` },
				}
			);
			const rj = await rRes.json();
			const arr = Array.isArray(rj?.recipients) ? rj.recipients : [];
			all = all.concat(arr);
		}
		recipients = all.filter((r: any) => r.userId === (target as any).userId);
		// get current user id for self-wrapping
		try {
			const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const me = await meRes.json();
			meUserId = me?.user?.id as string | undefined;
		} catch {}
	}
	if (recipients.length === 0) throw new Error("No recipients");

	// Encrypt content with AES-GCM
	const iv = nodeCrypto.randomBytes(12);
	const cekRaw = nodeCrypto.randomBytes(32);
	const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, true, ["encrypt", "wrapKey"]);
	const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv }, cek, new TextEncoder().encode(code));

	const wrappedKeys: any[] = [];
	const localDeviceId = (await context.secrets.get(DEVICE_ID_KEY)) as string | undefined;

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
		// self-wrap for author's current device to enable future backfill
		if (meUserId && localDeviceId) {
			const selfPub = await subtle.importKey(
				"jwk",
				encKeypair.publicKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				[]
			);
			const kekSelf = await subtle.deriveKey(
				{ name: "ECDH", public: selfPub },
				eph.privateKey,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt"]
			);
			const wrapIvSelf = nodeCrypto.randomBytes(12);
			const wrappedSelf = await subtle.encrypt({ name: "AES-GCM", iv: wrapIvSelf }, kekSelf, cekRaw);
			wrappedKeys.push({
				recipientUserId: meUserId,
				recipientDeviceId: localDeviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u: b64url(new Uint8Array(wrappedSelf as ArrayBuffer)),
				wrapIvB64u: b64url(new Uint8Array(wrapIvSelf)),
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
		// self-wrap for author's current device to enable future backfill
		if (meUserId && localDeviceId) {
			const selfPub = await subtle.importKey(
				"jwk",
				encKeypair.publicKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				[]
			);
			const kekSelf = await subtle.deriveKey(
				{ name: "ECDH", public: selfPub },
				eph.privateKey,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt"]
			);
			const wrapIvSelf = nodeCrypto.randomBytes(12);
			const wrappedSelf = await subtle.encrypt({ name: "AES-GCM", iv: wrapIvSelf }, kekSelf, cekRaw);
			wrappedKeys.push({
				recipientUserId: meUserId,
				recipientDeviceId: localDeviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u: b64url(new Uint8Array(wrappedSelf as ArrayBuffer)),
				wrapIvB64u: b64url(new Uint8Array(wrapIvSelf)),
			});
		}
	}

	const currentTeamId = target.kind === "team" ? (target.teamId ?? (await promptTeamId(context))) : undefined;

	const res = await fetch(
		// `${base}/protected/code-share/share`,
		`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.share}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
			body: JSON.stringify({
				ciphertextB64u: b64url(new Uint8Array(ciphertext as ArrayBuffer)),
				ivB64u: b64url(new Uint8Array(iv)),
				wrappedKeys,
				metadata: { teamId: currentTeamId, title, ...extraMetadata },
			}),
		}
	);
	if (!res.ok) throw new Error(`Share failed (${res.status})`);
}
