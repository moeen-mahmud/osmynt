import type { Context } from "hono";
import { z } from "zod";
import { ENV } from "@/config/env.config";
import { AuthService } from "@/services/auth.service";
// import { Routes } from "@/config/routes.config";
import { HANDSHAKE_EXPIRY_MS } from "@/config/constants";
import {
	aesGcmEncryptJson,
	deriveAesGcmKey,
	generateServerKeyPairP256,
	importEcPrivateKeyFromJwk,
	importEcPublicKeyFromJwk,
} from "@/utils/crypto.util";

// In-memory handshake store (ephemeral, single-instance)
type HandshakeRecord = {
	id: string;
	clientPublicKeyJwk: JsonWebKey; // client's ephemeral public key in JWK
	serverKeyPair?: { publicJwk: JsonWebKey; privateJwk: JsonWebKey };
	createdAt: number;
	encryptedPayload?: { ivB64u: string; ciphertextB64u: string };
};

const handshakeStore = new Map<string, HandshakeRecord>();

export class AuthController {
	static async githubAuthorize(c: Context) {
		const handshakeId = c.req.query("hid") ?? "";
		const params = new URLSearchParams({
			client_id: ENV.GITHUB.CLIENT_ID ?? "",
			redirect_uri: ENV.GITHUB.REDIRECT_URI ?? "",
			scope: "read:user user:email",
			state: handshakeId,
		});
		const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
		return c.json({ url });
	}

	static async githubCallback(c: Context) {
		const code = c.req.query("code");
		const handshakeId = c.req.query("hid") ?? c.req.query("state");
		if (!code) return c.json({ error: "Missing code" }, 400);
		try {
			const token = await AuthService.exchangeCodeForToken(code);
			const { user, email } = await AuthService.fetchGithubUser(token);
			const dbUser = await AuthService.findOrCreateUser({
				id: user.id,
				name: user.name,
				avatar: user.avatar_url,
				email,
			});
			const tokens = await AuthService.issueTokens(dbUser.id);

			if (handshakeId) {
				const hs = handshakeStore.get(handshakeId);
				if (!hs) return c.text("Invalid handshake", 400);
				const server = await generateServerKeyPairP256();
				const serverPriv = await importEcPrivateKeyFromJwk(server.serverPrivateKeyJwk);
				const clientPub = await importEcPublicKeyFromJwk(hs.clientPublicKeyJwk);
				const aesKey = await deriveAesGcmKey(serverPriv, clientPub);
				const encrypted = await aesGcmEncryptJson(aesKey, { tokens });
				hs.serverKeyPair = { publicJwk: server.serverPublicKeyJwk, privateJwk: server.serverPrivateKeyJwk };
				hs.encryptedPayload = encrypted;
				handshakeStore.set(handshakeId, hs);
				return c.json({ ok: true, handshakeId, serverPublicKeyJwk: server.serverPublicKeyJwk });
			}
			return c.json({
				user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, avatarUrl: dbUser.avatarUrl },
				tokens,
			});
		} catch (e) {
			return c.json({ error: (e as Error).message }, 500);
		}
	}

	// Handshake init: extension provides its ephemeral public key; server returns handshake id
	static async handshakeInit(c: Context) {
		const body = await c.req.json().catch(() => ({}));
		const schema = z.object({ clientPublicKeyJwk: z.any() });
		const parsed = schema.safeParse(body);
		if (!parsed.success) return c.json({ error: "Invalid body" }, 400);
		const id = crypto.randomUUID();
		handshakeStore.set(id, {
			id,
			clientPublicKeyJwk: parsed.data.clientPublicKeyJwk as unknown as JsonWebKey,
			createdAt: Date.now(),
		});
		return c.json({ handshakeId: id, expiresInMs: HANDSHAKE_EXPIRY_MS });
	}

	// For simplicity, we let the extension poll callback result (plaintext now). In production, encrypt with X25519 + AES-GCM using provided publicKey.
	static async handshakeRetrieve(c: Context) {
		const id = c.req.query("id");
		if (!id) return c.json({ error: "Missing id" }, 400);
		const rec = handshakeStore.get(id);
		if (!rec) return c.json({ error: "Not found" }, 404);
		if (Date.now() - rec.createdAt > HANDSHAKE_EXPIRY_MS) {
			handshakeStore.delete(id);
			return c.json({ error: "Expired" }, 410);
		}
		if (!rec.encryptedPayload || !rec.serverKeyPair) return c.json({ ready: false });
		return c.json({ ready: true, serverPublicKeyJwk: rec.serverKeyPair.publicJwk, payload: rec.encryptedPayload });
	}

	// Native provider login: client passes GitHub access token and client ECDH pubkey; server returns encrypted tokens
	static async loginWithToken(c: Context) {
		const body = await c.req.json().catch(() => ({}));
		const schema = z.object({
			provider: z.literal("github"),
			accessToken: z.string().min(10),
			handshake: z.object({ clientPublicKeyJwk: z.any() }),
		});
		const parsed = schema.safeParse(body);
		if (!parsed.success) return c.json({ error: "Invalid body" }, 400);
		const { accessToken, handshake } = parsed.data;
		try {
			// validate token by getting user profile/email
			const { user, email } = await AuthService.fetchGithubUser(accessToken);
			const dbUser = await AuthService.findOrCreateUser({
				id: user.id,
				name: user.name,
				avatar: user.avatar_url,
				email,
			});
			const tokens = await AuthService.issueTokens(dbUser.id);

			const server = await generateServerKeyPairP256();
			const serverPriv = await importEcPrivateKeyFromJwk(server.serverPrivateKeyJwk);
			const clientPub = await importEcPublicKeyFromJwk(handshake.clientPublicKeyJwk as unknown as JsonWebKey);
			const aesKey = await deriveAesGcmKey(serverPriv, clientPub);
			const encrypted = await aesGcmEncryptJson(aesKey, { tokens });
			return c.json({ serverPublicKeyJwk: server.serverPublicKeyJwk, payload: encrypted });
		} catch (e) {
			return c.json({ error: (e as Error).message }, 500);
		}
	}
}
