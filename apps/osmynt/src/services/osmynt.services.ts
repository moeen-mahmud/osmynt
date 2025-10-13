import * as vscode from "vscode";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, DEVICE_ID_KEY, ENC_KEYPAIR_JWK_KEY } from "@/constants/osmynt.constant";
import { b64uToBytes, b64url } from "@/utils/osmynt.utils";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import type {
	DeviceState,
	ShareTarget,
	AuthLoginResponse,
	KeysMeResponse,
	DeviceKeySummary,
} from "@/types/osmynt.types";

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
	const data: AuthLoginResponse = await res.json();

	const serverPub: any = await subtle.importKey(
		"jwk",
		data.serverPublicKeyJwk,
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
	const iv = b64uToBytes(data.payload.ivB64u);
	const ciphertext = b64uToBytes(data.payload.ciphertextB64u);
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

	// Check existing server devices to decide whether to auto-register or require pairing
	let devicesCount = 0;
	try {
		const { base, access } = await getBaseAndAccess(context);
		const dm = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const data: any = await dm.json();
		devicesCount = Array.isArray(data?.devices) ? data?.devices.length : 0;
	} catch {}

	let encKeypairJwk = await context.secrets.get(ENC_KEYPAIR_JWK_KEY);
	if (!encKeypairJwk) {
		if (devicesCount > 0) {
			// Another device already exists (primary). Do NOT auto-register this device.
			try {
				await vscode.commands.executeCommand("setContext", "osmynt.isRegisteredDevice", false);
				await vscode.commands.executeCommand("setContext", "osmynt.canPastePairing", true);
			} catch {}
			vscode.window
				.showInformationMessage(
					"Osmynt: Pair this device using 'Add Device (Companion - paste code)'.",
					{
						modal: true,
						detail: "If this is your primary device, you can repair it using 'Repair this device'.",
					},
					"List Devices",
					"Repair This Device",
					"Force Remove Device"
				)
				.then(action => {
					if (action === "List Devices") {
						vscode.commands.executeCommand("osmynt.listDevices");
					} else if (action === "Repair This Device") {
						vscode.commands.executeCommand("osmynt.repairDevice");
					} else if (action === "Force Remove Device") {
						vscode.commands.executeCommand("osmynt.forceRemoveDevice");
					}
				});
			return { deviceId };
		}
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
				const stillRegistered = await verifySelfDeviceRegistered(context);
				if (!stillRegistered) {
					await clearLocalDeviceSecrets(context);
					await vscode.window
						.showInformationMessage(
							"Osmynt: This device was removed.",
							{
								modal: true,
								detail: "Pair again to reconnect. However, if this device was your primary device, you can repair it using 'Repair this device'.",
							},
							"List Devices",
							"Repair This Device",
							"Force Remove Device"
						)
						.then(action => {
							if (action === "List Devices") {
								vscode.commands.executeCommand("osmynt.listDevices");
							} else if (action === "Repair This Device") {
								vscode.commands.executeCommand("osmynt.repairDevice");
							} else if (action === "Force Remove Device") {
								vscode.commands.executeCommand("osmynt.forceRemoveDevice");
							}
						});
				} else {
					await registerDeviceKey(context, deviceId, parsed.publicKeyJwk);
				}
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

export async function verifySelfDeviceRegistered(context: vscode.ExtensionContext): Promise<boolean> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		if (!localId) return false;
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const data: any = await res.json();
		const devices: Array<{ deviceId: string }> = Array.isArray(data?.devices) ? data?.devices : [];
		return devices.some(d => d.deviceId === localId);
	} catch {
		return true;
	}
}

export async function clearLocalDeviceSecrets(context: vscode.ExtensionContext): Promise<void> {
	try {
		await context.secrets.delete(DEVICE_ID_KEY);
	} catch {}
	try {
		await context.secrets.delete(ENC_KEYPAIR_JWK_KEY);
	} catch {}
}

export async function getDeviceState(context: vscode.ExtensionContext): Promise<DeviceState> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		const enc = await context.secrets.get(ENC_KEYPAIR_JWK_KEY);
		if (!localId || !enc) return { kind: "unpaired" };
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const data: KeysMeResponse = await res.json();
		const devices: DeviceKeySummary[] = Array.isArray(data?.devices) ? data.devices : [];
		const idx = devices.findIndex(d => d.deviceId === localId);
		if (idx === -1) return { kind: "removed" };
		return idx === 0
			? { kind: "registeredPrimary", deviceId: localId }
			: { kind: "registeredCompanion", deviceId: localId };
	} catch {
		// Network error → do not disrupt
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		const enc = await context.secrets.get(ENC_KEYPAIR_JWK_KEY);
		if (!localId || !enc) return { kind: "unpaired" };
		return { kind: "registeredCompanion", deviceId: localId };
	}
}

export async function initiateDevicePairing(context: vscode.ExtensionContext): Promise<string | null> {
	try {
		const nodeCrypto = await import("crypto");
		const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
		if (!subtle) throw new Error("WebCrypto Subtle API not available");
		const { base, access } = await getBaseAndAccess(context);

		// Start packing current device's public key for transfer
		const encKeypair = JSON.parse((await context.secrets.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
		if (!encKeypair?.publicKeyJwk) throw new Error("Missing device public key");
		const payload = JSON.stringify({ publicKeyJwk: encKeypair.publicKeyJwk });
		const iv = (await import("crypto")).randomBytes(12);

		// For pairing bootstrap, encrypt payload with a random symmetric key shown only on screen. !IMPORTANT
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
		const data: any = await res.json();
		if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
		const token = data?.token as string;
		// Show both token and pairingKey to user to transfer. !IMPORTANT
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
		const data: any = await res.json();
		if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
		const iv = b64uToBytes(data.ivB64u);
		const ciphertext = b64uToBytes(data.ciphertextB64u);
		const key = await subtle.importKey("raw", pairingKey, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
		const plaintext = await subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
		const msg = JSON.parse(Buffer.from(new Uint8Array(plaintext)).toString("utf-8"));
		const publicKeyJwk = msg?.publicKeyJwk;
		if (!publicKeyJwk) throw new Error("Invalid payload");
		// Generate own private key and register with backend. !IMPORTANT
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
		const j: any = await res.json();
		if (!res.ok || !j?.ok) throw new Error(j?.error || `Failed (${res.status})`);
		vscode.window.showInformationMessage("Device removed");
	} catch (e) {
		vscode.window.showErrorMessage(`Remove device failed: ${e}`);
	}
}

export async function backfillAccessForCompanion(context: vscode.ExtensionContext): Promise<void> {
	try {
		const { base, access } = await getBaseAndAccess(context);
		// Determine companion device id. !IMPORTANT
		const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const me: any = await meRes.json();
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
		const list: any = await listRes.json();
		const items: Array<{ id: string; wrappedKeys?: any[] }> = Array.isArray(list?.items) ? list.items : [];

		const nodeCrypto = await import("crypto");
		const subtle: any = (globalThis as any).crypto?.subtle ?? (nodeCrypto as any).webcrypto?.subtle;
		if (!subtle) throw new Error("WebCrypto Subtle API not available");

		// load the device keypair. Important for future backfill. !IMPORTANT
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

		// Iterate and add a wrapped key for companion device per item where not already present. !IMPORTANT
		for (const it of items) {
			try {
				// fetch full item to get ciphertext iv and existing wraps
				const itemRes = await fetch(
					`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(it.id))}`,
					{
						headers: { Authorization: `Bearer ${access}` },
					}
				);
				const full: any = await itemRes.json();
				if (!itemRes.ok) continue;
				const already = (full?.wrappedKeys ?? []).some(
					(wk: any) => wk?.recipientDeviceId === companion.deviceId
				);
				if (already) continue;

				// We need the CEK; since server stores only ciphertext, we cannot decrypt without sender-side CEK.
				// Strategy: require that this device authored the snippet OR stored CEK in memory.
				// For v1, only backfill when authored by me.
				const meTeamsRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
					headers: { Authorization: `Bearer ${access}` },
				});
				const meTeams: any = await meTeamsRes.json();
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
				const wrapIv2 = nodeCrypto.randomBytes(12);
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
		const state = await getDeviceState(context);
		const isRegistered = state.kind === "registeredPrimary" || state.kind === "registeredCompanion";
		const isPrimary = state.kind === "registeredPrimary";
		const isCompanion = state.kind === "registeredCompanion";
		await vscode.commands.executeCommand("setContext", "osmynt.isRegisteredDevice", isRegistered);
		await vscode.commands.executeCommand("setContext", "osmynt.isPrimaryDevice", isPrimary);
		await vscode.commands.executeCommand("setContext", "osmynt.isCompanionDevice", isCompanion);
		await vscode.commands.executeCommand("setContext", "osmynt.canGeneratePairing", isPrimary);
		await vscode.commands.executeCommand("setContext", "osmynt.canPastePairing", !isRegistered || isCompanion);
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
		const data: any = await res.json();
		// Prefer owned team; fallback to first team
		const teams: Array<{ id: string; ownerId: string }> = Array.isArray(data?.teams) ? data.teams : [];
		const meOwned = teams.find(t => t.ownerId && data?.user?.id && t.ownerId === data.user.id)?.id;
		return (meOwned || teams[0]?.id) as string | undefined;
	} catch {
		return undefined;
	}
}

export async function tryDecryptSnippet(context: vscode.ExtensionContext, data: any): Promise<string | null> {
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
				for (const wk of data.wrappedKeys ?? []) {
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
						const iv = b64uToBytes(data.ivB64u);
						const ciphertext = b64uToBytes(data.ciphertextB64u);
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
			if (teamKeyMode && (data?.metadata?.teamId as string | undefined)) {
				const teamKeyNamespace = config.get<string>("teamKeyNamespace") ?? "default";
				const teamKeyStorageKey = `osmynt.teamKey.${teamKeyNamespace}`;
				const teamKeyRawB64 = await context.secrets.get(teamKeyStorageKey);
				if (teamKeyRawB64) {
					const teamKeyRaw = Buffer.from(teamKeyRawB64, "base64");
					const teamKey = await subtle.importKey("raw", teamKeyRaw, { name: "AES-GCM", length: 256 }, false, [
						"decrypt",
					]);
					const wk = (data.wrappedKeys ?? [])[0];
					if (wk?.wrappedCekB64u && wk?.wrapIvB64u) {
						const wrappedBytes = b64uToBytes(wk.wrappedCekB64u);
						const wrapIv = b64uToBytes(wk.wrapIvB64u);
						const cekRaw = await subtle.decrypt({ name: "AES-GCM", iv: wrapIv }, teamKey, wrappedBytes);
						const cek = await subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, false, [
							"decrypt",
						]);
						const iv = b64uToBytes(data.ivB64u);
						const ciphertext = b64uToBytes(data.ciphertextB64u);
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
	const j: any = await res.json();
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
		const j: any = await recipientsRes.json();
		recipients = Array.isArray(j?.recipients) ? j.recipients : [];
		// get current user id for self-wrapping
		try {
			const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const me: any = await meRes.json();
			meUserId = me?.user?.id as string | undefined;
		} catch {}
	} else {
		// Aggregate recipients across all teams then filter by userId
		const tmRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const tm: any = await tmRes.json();
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
			const rj: any = await rRes.json();
			const arr = Array.isArray(rj?.recipients) ? rj.recipients : [];
			all = all.concat(arr);
		}
		recipients = all.filter((r: any) => r.userId === (target as any).userId);
		// get current user id for self-wrapping
		try {
			const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
			const me: any = await meRes.json();
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

export async function showDiffPreview(
	context: vscode.ExtensionContext,
	diffData: {
		snippetId: string;
		content: string;
		metadata: any;
		originalContent: string;
		startLine: number;
		endLine: number;
		filePath: string;
		relativeFilePath: string;
	}
) {
	const { content, originalContent, startLine, endLine, filePath, snippetId } = diffData;

	// Create a new branch for the changes
	const branchName = `osmynt-diff-${Date.now()}`;

	try {
		// Check if git is available
		const gitStatus = await vscode.commands.executeCommand("git.status");
		if (!gitStatus) {
			vscode.window.showWarningMessage("Git repository not found. Changes will be applied directly to the file.");
		} else {
			// Create new branch
			await vscode.commands.executeCommand("git.checkout", "-b", branchName);
			vscode.window.showInformationMessage(`Created new branch: ${branchName}`);
		}
	} catch {
		console.log("Git operations failed, proceeding without branch creation");
	}

	// Store diff data for commands to access
	await context.globalState.update("osmynt.currentDiffData", diffData);

	// Show quick pick with options for better UX
	const action = await vscode.window.showQuickPick(
		[
			{
				label: "Show Side by Side (Git Working Tree)",
				value: "sideBySide",
				description: "Open VS Code's built-in diff with line-by-line controls",
			},
			{
				label: "Apply Changes Directly (Fastest Option)",
				value: "applyDirect",
				description: "Apply changes to the file immediately",
			},
			{ label: "Cancel", value: "cancel", description: "Don't apply any changes" },
		],
		{
			placeHolder: "How would you like to view and apply the changes?",
			canPickMany: false,
		}
	);

	if (!action || action.value === "cancel") return;

	if (action.value === "sideBySide") {
		await showSideBySideView({
			snippetId,
			originalContent,
			newContent: content,
			startLine,
			endLine,
			filePath,
			relativeFilePath: diffData.relativeFilePath,
			metadata: diffData.metadata,
		});
	} else if (action.value === "applyDirect") {
		await applyAllChanges({
			snippetId,
			originalContent,
			newContent: content,
			startLine,
			endLine,
			filePath,
			relativeFilePath: diffData.relativeFilePath,
			metadata: diffData.metadata,
		});
		vscode.window.showInformationMessage("Changes applied directly to the file!");
	}
}

export async function applyAllChanges(diffData: {
	snippetId: string;
	originalContent: string;
	newContent: string;
	startLine: number;
	endLine: number;
	filePath: string;
	relativeFilePath: string;
	metadata: any;
}) {
	const { newContent, startLine, endLine, filePath } = diffData;

	try {
		// Read current file content
		const fileUri = vscode.Uri.file(filePath);
		const fileContent = await vscode.workspace.fs.readFile(fileUri);
		const currentContent = new TextDecoder().decode(fileContent);
		const lines = currentContent.split("\n");

		// Replace the specified lines with new content
		const newLines = newContent.split("\n");
		const beforeLines = lines.slice(0, startLine - 1);
		const afterLines = lines.slice(endLine);

		const updatedContent = [...beforeLines, ...newLines, ...afterLines].join("\n");

		// Write the updated content back to the file
		await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(updatedContent));

		// Open the file in the editor
		const doc = await vscode.workspace.openTextDocument(fileUri);
		await vscode.window.showTextDocument(doc);
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to apply changes to file: ${error}`);
		throw error;
	}
}

// Enhanced diff functionality

export async function showSideBySideView(diffData: {
	snippetId: string;
	originalContent: string;
	newContent: string;
	startLine: number;
	endLine: number;
	filePath: string;
	relativeFilePath: string;
	metadata: any;
}) {
	// Check if the file exists in the current workspace
	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceRoot) {
		vscode.window.showWarningMessage("No workspace found. Falling back to snippet view.");
		await showSnippetView(diffData);
		return;
	}

	// Check if the file path matches the current workspace
	const fullFilePath = diffData.filePath;
	const isFileInWorkspace = fullFilePath.startsWith(workspaceRoot);

	if (!isFileInWorkspace) {
		vscode.window.showInformationMessage(
			`File ${diffData.relativeFilePath} is not in the current workspace. Showing snippet view instead.`
		);
		await showSnippetView(diffData);
		return;
	}

	// Check if the file actually exists
	try {
		await vscode.workspace.fs.stat(vscode.Uri.file(fullFilePath));
	} catch {
		vscode.window.showInformationMessage(
			`File ${diffData.relativeFilePath} does not exist. Showing snippet view instead.`
		);
		await showSnippetView(diffData);
		return;
	}

	// File exists and is in workspace - use VS Code's Git Working Tree mechanism
	await showGitWorkingTreeView(diffData);
}

async function showGitWorkingTreeView(diffData: {
	snippetId: string;
	originalContent: string;
	newContent: string;
	startLine: number;
	endLine: number;
	filePath: string;
	relativeFilePath: string;
	metadata: any;
}) {
	// Create a temporary file with the snippet content (LEFT SIDE)
	const snippetUri = vscode.Uri.file(`${diffData.filePath}.osmynt-snippet-${diffData.snippetId.slice(0, 8)}`);
	await vscode.workspace.fs.writeFile(snippetUri, new TextEncoder().encode(diffData.newContent));

	// Original file (RIGHT SIDE)
	const originalUri = vscode.Uri.file(diffData.filePath);

	// Use VS Code's built-in diff with snippet on LEFT, original on RIGHT
	await vscode.commands.executeCommand("vscode.diff", snippetUri, originalUri, `Incoming changes ↔ Original file`);

	// Set up a listener to monitor when the diff editor is closed
	// This ensures we clean up properly and don't save the snippet file
	const changeDisposable = vscode.workspace.onDidCloseTextDocument(async document => {
		if (document.uri.fsPath === snippetUri.fsPath) {
			// The snippet file is being closed, make sure it's not saved
			// and clean up the temporary file
			try {
				await vscode.workspace.fs.delete(snippetUri);
			} catch {
				// File might already be deleted, ignore error
			}
		}
	});

	// Show instructions | configurable from config -> DO not show this message again
	vscode.window.showInformationMessage(`You are now in the Git Working Tree View`, {
		modal: true,
		detail: `
• LEFT: Code blocks content (new changes)
• RIGHT: Original file (your current file)
• Use VS Code's diff controls to apply changes from code blocks to original file.
• Save the changes to the original file to apply the changes.
		`,
	});

	// Set up cleanup when the diff editor is closed
	const closeDisposable = vscode.workspace.onDidCloseTextDocument(async document => {
		if (document.uri.fsPath === snippetUri.fsPath) {
			// Clean up the temporary snippet file and disposables
			try {
				await vscode.workspace.fs.delete(snippetUri);
			} catch {
				// File might already be deleted, ignore error
			}
			changeDisposable.dispose();
			closeDisposable.dispose();
		}
	});
}

async function showSnippetView(diffData: {
	snippetId: string;
	originalContent: string;
	newContent: string;
	startLine: number;
	endLine: number;
	filePath: string;
	relativeFilePath: string;
	metadata: any;
}) {
	// Fallback: Show the snippet content in a new editor
	const tempUri = vscode.Uri.file(`/tmp/osmynt-snippet-${diffData.snippetId.slice(0, 8)}.txt`);
	await vscode.workspace.fs.writeFile(tempUri, new TextEncoder().encode(diffData.newContent));

	const doc = await vscode.workspace.openTextDocument(tempUri);
	await vscode.window.showTextDocument(doc);

	vscode.window.showInformationMessage("Code blocks view opened! This is the new content from the code blocks.");

	// Set up cleanup when the snippet editor is closed
	const closeDisposable = vscode.workspace.onDidCloseTextDocument(async document => {
		if (document.uri.fsPath === tempUri.fsPath) {
			// Clean up the temporary snippet file
			try {
				await vscode.workspace.fs.delete(tempUri);
			} catch {
				// File might already be deleted, ignore error
			}
			closeDisposable.dispose();
		}
	});
}
