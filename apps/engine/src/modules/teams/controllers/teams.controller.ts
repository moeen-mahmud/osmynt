import type { Context } from "hono";
import prisma from "@/config/database.config";
import { logger } from "@osmynt-core/library";
import { TeamsService } from "@/modules/teams/services/teams.service";

export class TeamsController {
	static async me(c: Context) {
		try {
			const user = c.get("user") as { id: string } | undefined;
			if (!user) {
				logger.error("Unauthorized");
				return c.json({ error: "Unauthorized" }, 401);
			}

			const { teams, membersByTeam } = await TeamsService.getMeTeams(user);
			return c.json(
				{
					user: { id: user.id },
					teams: teams.map(t => ({ id: t.id, name: t.name, slug: t.slug, ownerId: t.ownerId })),
					membersByTeam,
				},
				200
			);
		} catch (error) {
			logger.error("Error listing teams", { error });
			return c.json({ error: "Internal server error" }, 500);
		}
	}

	static async invite(c: Context) {
		try {
			const user = c.get("user") as { id: string } | undefined;
			if (!user) {
				logger.error("Unauthorized");
				return c.json({ error: "Unauthorized" }, 401);
			}
			const teamId = c.req.param("teamId");
			const token = await TeamsService.invite(teamId, user);
			return c.json({ token }, 200);
		} catch (error) {
			logger.error("Error inviting to team", { error });
			return c.json({ error: "Internal server error" }, 500);
		}
	}

	static async accept(c: Context) {
		try {
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
			await prisma.auditLog.create({
				data: {
					action: "TEAM_MEMBER_ACCEPTED_INVITATION",
					userId: user.id,
					metadata: { teamId: invite.teamId },
				},
			});
			await prisma.teamInvitation.update({ where: { token: inviteToken }, data: { acceptedAt: new Date() } });
			await prisma.auditLog.create({
				data: {
					action: "TEAM_INVITATION_ACCEPTED",
					userId: user.id,
					metadata: { teamId: invite.teamId },
				},
			});
			logger.info("Accepted team invitation", { inviteToken });
			return c.json({ ok: true }, 200);
		} catch (error) {
			logger.error("Error accepting team invitation", { error });

			return c.json({ error: (error as Error).message }, 500);
		}
	}

	static async removeTeamMember(c: Context) {
		try {
			const user = c.get("user") as { id: string } | undefined;
			if (!user) {
				logger.error("Unauthorized");
				return c.json({ error: "Unauthorized" }, 401);
			}
			const teamId = c.req.param("teamId");
			const userId = c.req.param("userId");

			const response = await TeamsService.removeTeamMember(teamId, userId);
			logger.info("Removed team member", { teamId, userId });
			return c.json(response, 200);
		} catch (error) {
			logger.error("Error removing team member", { error });
			return c.json({ error: (error as Error).message }, 500);
		}
	}
}
