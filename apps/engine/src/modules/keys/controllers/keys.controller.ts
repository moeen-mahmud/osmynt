import type { Context } from "hono";
import prisma from "@/config/database.config";
import { KeysService } from "@/modules/keys/services/keys.service";
import { keysRegisterSchema } from "@/modules/keys/schemas/keys.schema";
import { logger } from "@osmynt-core/library";
import { KEYS_AUDIT_LOG_ACTIONS } from "@/modules/keys/constants/keys.constants";
import { PairingStore } from "@/modules/keys/services/pairing.store";
import { nanoid } from "nanoid";
import { publishBroadcast } from "@/config/realtime.config";

export class KeysController {
	static async register(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const body = await c.req.json().catch(() => ({}));
		const schema = keysRegisterSchema;
		const parsed = schema.safeParse(body);
		if (!parsed.success) {
			logger.error("Invalid body");
			return c.json({ error: "Invalid body" }, 400);
		}
		await KeysService.upsertDeviceKey({
			userId: user.id,
			deviceId: parsed.data.deviceId,
			encryptionPublicKeyJwk: parsed.data.encryptionPublicKeyJwk,
			signingPublicKeyJwk: parsed.data.signingPublicKeyJwk,
			algorithm: parsed.data.algorithm,
		});
		await prisma.auditLog.create({
			data: {
				action: KEYS_AUDIT_LOG_ACTIONS.DEVICE_KEY_REGISTERED,
				userId: user.id,
				metadata: {},
			},
		});
		try {
			await publishBroadcast("keys:changed", { userId: user.id });
		} catch {}
		logger.info("Registered", { userId: user.id });
		return c.json({ ok: true }, 200);
	}

	static async me(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const devices = await KeysService.listUserDevices(user.id);
		const primaryId = devices[0]?.deviceId;
		const enriched = devices.map(d => ({
			deviceId: d.deviceId,
			encryptionPublicKeyJwk: d.encryptionPublicKeyJwk,
			signingPublicKeyJwk: d.signingPublicKeyJwk,
			createdAt: d.createdAt,
			isPrimary: d.deviceId === primaryId,
		}));
		logger.info("Listed devices", { userId: user.id });
		return c.json({ devices: enriched }, 200);
	}

	static async teamDefault(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		// default team: owner's team where user is member
		const membership = await prisma.teamMember.findFirst({ where: { userId: user.id }, include: { Team: true } });
		if (!membership) {
			logger.error("No membership found");
			return c.json({ recipients: [] }, 200);
		}
		const recipients = await KeysService.listTeamRecipients(membership.teamId);
		logger.info("Listed recipients", { userId: user.id });
		return c.json({ recipients }, 200);
	}

	static async teamById(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const teamId = c.req.param("teamId");
		const membership = await prisma.teamMember.findFirst({ where: { teamId, userId: user.id } });
		if (!membership) {
			return c.json({ error: "Forbidden" }, 403);
		}
		const recipients = await KeysService.listTeamRecipients(teamId);
		logger.info("Listed recipients by team", { teamId });
		return c.json({ recipients }, 200);
	}

	static async pairingInit(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const body = await c.req.json().catch(() => ({}));
		const deviceId = body?.deviceId as string | undefined;
		const ivB64u = body?.ivB64u as string | undefined;
		const ciphertextB64u = body?.ciphertextB64u as string | undefined;
		const ttlMs = Math.min(Math.max(Number(body?.ttlMs ?? 1000 * 60 * 5), 1000), 1000 * 60 * 10);
		if (!deviceId || !ivB64u || !ciphertextB64u) return c.json({ error: "Invalid body" }, 400);
		const devices = await KeysService.listUserDevices(user.id);
		const sorted = [...devices].sort(
			(a: any, b: any) => new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime()
		);
		const primaryId = sorted[0]?.deviceId as string | undefined;
		const isPrimary = devices.length === 0 || (primaryId && primaryId === deviceId);
		if (!isPrimary) return c.json({ error: "Only primary device can initiate pairing" }, 403);
		const token = nanoid(24);
		await PairingStore.save(
			token,
			{ userId: user.id, ivB64u, ciphertextB64u, createdAt: Date.now(), expiresAt: Date.now() + ttlMs },
			ttlMs
		);
		await prisma.auditLog.create({
			data: {
				action: KEYS_AUDIT_LOG_ACTIONS.DEVICE_KEY_REGISTERED,
				userId: user.id,
				metadata: { pairingInit: true },
			},
		});
		logger.info("Pairing init", { userId: user.id });
		return c.json({ token }, 200);
	}

	static async pairingClaim(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const body = await c.req.json().catch(() => ({}));
		const token = body?.token as string | undefined;
		if (!token) return c.json({ error: "Invalid body" }, 400);
		const rec = await PairingStore.get(token);
		if (!rec) return c.json({ error: "Not found" }, 404);
		if (rec.userId !== user.id) return c.json({ error: "Forbidden" }, 403);
		await PairingStore.del(token);
		logger.info("Pairing claim", { userId: user.id });
		return c.json({ ivB64u: rec.ivB64u, ciphertextB64u: rec.ciphertextB64u }, 200);
	}

	static async deviceRemove(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const deviceId = c.req.param("deviceId");
		if (!deviceId) return c.json({ error: "Invalid device" }, 400);
		const devices = await KeysService.listUserDevices(user.id);
		const primaryId = devices[0]?.deviceId;
		if (deviceId === primaryId) return c.json({ error: "Cannot remove primary device" }, 400);
		await prisma.deviceKey.deleteMany({ where: { userId: user.id, deviceId } });
		await prisma.auditLog.create({
			data: {
				action: KEYS_AUDIT_LOG_ACTIONS.DEVICE_KEY_REGISTERED,
				userId: user.id,
				metadata: { removed: deviceId },
			},
		});
		try {
			await publishBroadcast("keys:changed", { userId: user.id });
		} catch {}
		logger.info("Device removed", { userId: user.id, deviceId });
		return c.json({ ok: true }, 200);
	}
}
