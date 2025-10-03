import type { Context } from "hono";
import prisma from "@/config/database.config";
import { nanoid } from "nanoid";
import { logger } from "@osmynt-core/library";

export class TeamsController {
	static async me(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const membership = await prisma.teamMember.findFirst({ where: { userId: user.id }, include: { Team: true } });
		if (!membership) {
			logger.error("No membership found");
			return c.json({ team: null, members: [] });
		}
		const members = await prisma.teamMember.findMany({
			where: { teamId: membership.teamId },
			include: { User: true },
		});
		logger.info("Listed team members", { teamId: membership.teamId });
		return c.json({
			team: membership.Team,
			members: members.map(m => ({
				id: m.User.id,
				name: m.User.name,
				email: m.User.email,
				avatarUrl: m.User.avatarUrl,
			})),
		});
	}

	static async invite(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const teamId = c.req.param("teamId");
		const token = nanoid(32);
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
		await prisma.teamInvitation.create({ data: { teamId, inviterId: user.id, token, expiresAt } });
		logger.info("Created team invitation", { teamId, inviterId: user.id });
		return c.json({ token });
	}

	static async accept(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const inviteToken = c.req.param("inviteToken");
		const invite = await prisma.teamInvitation.findUnique({ where: { token: inviteToken } });
		if (!invite || invite.expiresAt < new Date()) {
			logger.error("Invalid or expired");
			return c.json({ error: "Invalid or expired" }, 400);
		}
		await prisma.teamMember.upsert({
			where: {
				teamId_userId: {
					userId: user.id,
					teamId: invite.teamId,
				},
			},
			create: { userId: user.id, teamId: invite.teamId, role: "MEMBER" },
			update: {},
		});
		await prisma.teamInvitation.update({ where: { token: inviteToken }, data: { acceptedAt: new Date() } });
		logger.info("Accepted team invitation", { inviteToken });
		return c.json({ ok: true });
	}
}
