import { logger } from "@osmynt-core/library";
import prisma from "@/config/database.config";
import { nanoid } from "nanoid";
import { TEAMS_AUDIT_LOG_ACTIONS } from "@/modules/teams/constants/teams.constant";

export class TeamsService {
	static async getTeamInvitation(inviteToken: string) {
		const invite = await prisma.teamInvitation.findUnique({ where: { token: inviteToken } });
		if (!invite) {
			throw new Error("Invitation not found");
		}
		return invite;
	}

	static async getMeTeams(user: { id: string }) {
		let memberships = await prisma.teamMember.findMany({ where: { userId: user.id } });

		if (memberships.length === 0) {
			const me = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
			});

			const teamName = `${me?.name || me?.email?.split("@")[0] || "User"}'s Team`;

			const team = await prisma.team.create({
				data: {
					name: teamName,
					ownerId: user.id,
					slug: nanoid(10),
				},
			});
			logger.info("Created default team", { team });
			await prisma.auditLog.create({
				data: {
					action: TEAMS_AUDIT_LOG_ACTIONS.TEAM_CREATED_DEFAULT,
					userId: user.id,
					metadata: { teamId: team.id },
				},
			});

			await prisma.teamMember.create({
				data: {
					teamId: team.id,
					userId: user.id,
					role: "OWNER",
				},
			});
			await prisma.auditLog.create({
				data: {
					action: TEAMS_AUDIT_LOG_ACTIONS.TEAM_MEMBER_CREATED_DEFAULT,
					userId: user.id,
					metadata: { teamId: team.id },
				},
			});
			memberships = await prisma.teamMember.findMany({
				where: {
					userId: user.id,
				},
			});
		}

		const teamIds = memberships.map(m => m.teamId);

		const teams = await prisma.team.findMany({
			where: {
				id: { in: teamIds },
			},
		});
		const membersByTeam: Record<string, Array<{ id: string; name: string; email: string; avatarUrl: string }>> = {};

		for (const team of teams) {
			const ms = await prisma.teamMember.findMany({
				where: {
					teamId: team.id,
				},
				include: { User: true },
			});
			membersByTeam[team.id] = ms.map(member => ({
				id: member.User.id,
				name: member.User.name,
				email: member.User.email,
				avatarUrl: member.User.avatarUrl,
			}));
		}
		logger.info("Listed teams and members", { teamCount: teams.length, membershipCount: memberships.length });

		return { teams, membersByTeam };
	}

	static async invite(teamId: string, user: { id: string }) {
		const token = nanoid(32);
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

		await prisma.teamInvitation.create({
			data: {
				teamId,
				inviterId: user.id,
				token,
				expiresAt,
			},
		});
		await prisma.auditLog.create({
			data: {
				action: TEAMS_AUDIT_LOG_ACTIONS.TEAM_INVITATION_CREATED,
				userId: user.id,
				metadata: { teamId, inviterId: user.id },
			},
		});
		logger.info("Created team invitation", { teamId, inviterId: user.id });

		return token;
	}

	static async acceptInvitation(teamId: string, userId: string, inviteToken: string) {
		await prisma.teamMember.upsert({
			where: {
				teamId_userId: {
					userId: userId,
					teamId: teamId,
				},
			},
			create: { userId: userId, teamId: teamId, role: "MEMBER" },
			update: {},
		});
		await prisma.auditLog.create({
			data: {
				action: TEAMS_AUDIT_LOG_ACTIONS.TEAM_MEMBER_ACCEPTED_INVITATION,
				userId: userId,
				metadata: { teamId: teamId },
			},
		});
		await prisma.teamInvitation.update({ where: { token: inviteToken }, data: { acceptedAt: new Date() } });
		logger.info("Accepted team invitation", { inviteToken });

		return { ok: true };
	}

	static async removeTeamMember(teamId: string, userId: string) {
		// ensure user is the owner of the team
		const team = await prisma.team.findUnique({ where: { id: teamId } });
		if (!team) {
			throw new Error("Team not found");
		}

		const isOwner = await prisma.teamMember.findFirst({ where: { teamId, userId, role: "OWNER" } });

		// ensure the owner is not removing himself
		if (isOwner) {
			throw new Error("Owner cannot remove himself from the team");
		}

		await prisma.teamMember.delete({ where: { teamId_userId: { teamId, userId } } });

		await prisma.auditLog.create({
			data: {
				action: TEAMS_AUDIT_LOG_ACTIONS.TEAM_MEMBER_REMOVED,
				userId: userId,
				metadata: { teamId },
			},
		});
		logger.info("Removed team member", { teamId, userId });
		return { ok: true };
	}
}
