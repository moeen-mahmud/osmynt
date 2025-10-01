import type { Context } from "hono";
import { z } from "zod";
import prisma from "@/config/database.config";

export class KeysController {
	static async register(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) return c.json({ error: "Unauthorized" }, 401);
		const body = await c.req.json().catch(() => ({}));
		const schema = z.object({
			deviceId: z.string(),
			encryptionPublicKeyJwk: z.any(),
			signingPublicKeyJwk: z.any().optional(),
			algorithm: z.string().default("ECDH-P-256"),
		});
		const parsed = schema.safeParse(body);
		if (!parsed.success) return c.json({ error: "Invalid body" }, 400);
		await prisma.deviceKey.upsert({
			where: { userId_deviceId: { userId: user.id, deviceId: parsed.data.deviceId } },
			create: {
				userId: user.id,
				deviceId: parsed.data.deviceId,
				encryptionPublicKeyJwk: parsed.data.encryptionPublicKeyJwk as unknown as object,
				signingPublicKeyJwk: (parsed.data.signingPublicKeyJwk as unknown as object) ?? undefined,
				algorithm: parsed.data.algorithm,
			},
			update: {
				encryptionPublicKeyJwk: parsed.data.encryptionPublicKeyJwk as unknown as object,
				signingPublicKeyJwk: (parsed.data.signingPublicKeyJwk as unknown as object) ?? undefined,
				algorithm: parsed.data.algorithm,
			},
		});
		return c.json({ ok: true }, 200);
	}

	static async me(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) return c.json({ error: "Unauthorized" }, 401);
		const devices = await prisma.deviceKey.findMany({ where: { userId: user.id } });
		return c.json({ devices }, 200);
	}

	static async teamDefault(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) return c.json({ error: "Unauthorized" });
		// default team: owner's team where user is member
		const membership = await prisma.teamMember.findFirst({ where: { userId: user.id }, include: { Team: true } });
		if (!membership) return c.json({ recipients: [] });
		const members = await prisma.teamMember.findMany({ where: { teamId: membership.teamId } });
		const userIds = members.map(m => m.userId);
		const keys = await prisma.deviceKey.findMany({ where: { userId: { in: userIds } } });
		const recipients = keys.map(k => ({
			userId: k.userId,
			deviceId: k.deviceId,
			encryptionPublicKeyJwk: k.encryptionPublicKeyJwk as unknown as object,
			signingPublicKeyJwk: (k.signingPublicKeyJwk as unknown as object) ?? undefined,
		}));
		return c.json({ recipients }, 200);
	}
}
