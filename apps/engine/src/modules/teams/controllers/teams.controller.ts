import type { Context } from "hono";
import { logger } from "@osmynt-core/library";
import { TeamsService } from "@/modules/teams/services/teams.service";
import { publishBroadcast } from "@/config/realtime.config";

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
			const invite = await TeamsService.getTeamInvitation(inviteToken);

			if (!invite || invite.expiresAt < new Date()) {
				logger.error("Invalid or expired");
				return c.json({ error: "Invalid or expired" }, 400);
			}

			const response = await TeamsService.acceptInvitation(invite.teamId, user.id, inviteToken);
			try {
				await publishBroadcast("team:memberJoined", { teamId: invite.teamId, userId: user.id });
			} catch {}

			return c.json(response, 200);
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
