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
		// Return all teams for this user (owned and memberships)
		let memberships = await prisma.teamMember.findMany({ where: { userId: user.id } });
		if (memberships.length === 0) {
			const me = await prisma.user.findUnique({ where: { id: user.id } });
			const teamName = `${me?.name || me?.email?.split("@")[0] || "My"}'s Team`;
			const team = await prisma.team.create({ data: { name: teamName, ownerId: user.id, slug: nanoid(10) } });
			await prisma.teamMember.create({ data: { teamId: team.id, userId: user.id, role: "OWNER" } });
			memberships = await prisma.teamMember.findMany({ where: { userId: user.id } });
		}
		const teamIds = memberships.map(m => m.teamId);
		const teams = await prisma.team.findMany({ where: { id: { in: teamIds } } });
		const membersByTeam: Record<string, Array<{ id: string; name: string; email: string; avatarUrl: string }>> = {};
		for (const t of teams) {
			const ms = await prisma.teamMember.findMany({ where: { teamId: t.id }, include: { User: true } });
			membersByTeam[t.id] = ms.map(m => ({
				id: m.User.id,
				name: m.User.name,
				email: m.User.email,
				avatarUrl: m.User.avatarUrl,
			}));
		}
		logger.info("Listed teams and members", { teamCount: teams.length });
		return c.json({
			user: { id: user.id },
			teams: teams.map(t => ({ id: t.id, name: t.name, slug: t.slug, ownerId: t.ownerId })),
			membersByTeam,
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
