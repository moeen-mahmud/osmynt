import type { Context } from "hono";
import prisma from "@/config/database.config";
import { KeysService } from "@/modules/keys/services/keys.service";
import { keysRegisterSchema } from "@/modules/keys/schemas/keys.schema";
import { logger } from "@osmynt-core/library";
import { KEYS_AUDIT_LOG_ACTIONS } from "@/modules/keys/constants/keys.constants";

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
		logger.info("Listed devices", { userId: user.id });
		return c.json({ devices }, 200);
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
}
