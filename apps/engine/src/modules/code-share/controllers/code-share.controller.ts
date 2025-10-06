import type { Context } from "hono";
import prisma from "@/config/database.config";
import { CodeShareService } from "@/modules/code-share/services/code-share.service";
import { logger } from "@osmynt-core/library";
import { codeShareSchema } from "@/modules/code-share/schemas/code-share.schema";
import { CODE_SHARE_ALGORITHM, CODE_SHARE_AUDIT_LOG_ACTIONS } from "@/modules/code-share/constants/code-share.constant";
import { getBroadcastChannel } from "@/config/supabase.config";
import { ENV } from "@/config/env.config";
export class CodeShareController {
	static async share(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const body = await c.req.json().catch(() => ({}));
		const schema = codeShareSchema;
		const parsed = schema.safeParse(body);
		if (!parsed.success) return c.json({ error: "Invalid body" }, 400);
		const created = await CodeShareService.share({
			authorId: user.id,
			ciphertextB64u: parsed.data.ciphertextB64u,
			ivB64u: parsed.data.ivB64u,
			aad: parsed.data.aad ?? undefined,
			wrappedKeys: parsed.data.wrappedKeys,
			metadata: parsed.data.metadata,
		});

		await prisma.auditLog.create({
			data: {
				action: CODE_SHARE_AUDIT_LOG_ACTIONS.CODE_SHARE_CREATED,
				userId: user.id,
				metadata: { codeShareId: created.id },
			},
		});

		try {
			const channel = await getBroadcastChannel();
			const author = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true } });
			const meta: any = parsed.data.metadata ?? {};
			const recipientUserIds = Array.from(
				new Set((parsed.data.wrappedKeys || []).map((w: any) => w?.recipientUserId).filter(Boolean))
			) as string[];
			let firstRecipientName: string | undefined;
			if (!meta.teamId && recipientUserIds.length > 0) {
				const first = await prisma.user.findUnique({
					where: { id: recipientUserIds[0] },
					select: { name: true },
				});
				firstRecipientName = first?.name ?? undefined;
			}
			let teamName: string | undefined;
			if (meta.teamId) {
				const team = await prisma.team.findUnique({ where: { id: meta.teamId }, select: { name: true } });
				teamName = team?.name ?? undefined;
			}
			await channel.send({
				type: "broadcast",
				event: "snippet:created",
				payload: {
					id: created.id,
					title: meta?.title,
					authorId: user.id,
					authorName: author?.name,
					recipientUserIds,
					teamId: meta?.teamId,
					teamName,
					firstRecipientName,
				},
			});
		} catch (error) {
			logger.error("Failed to broadcast snippet:created", { error });
		}
		logger.info("Shared", { id: created.id });
		return c.json({ id: created.id }, 200);
	}

	static async listTeam(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const q = new URL(c.req.url).searchParams;
		const teamId = q.get("teamId");
		if (teamId) {
			const isMember = await prisma.teamMember.findFirst({ where: { userId: user.id, teamId } });
			if (!isMember) return c.json({ error: "Forbidden" }, 403);
			const items = await CodeShareService.listTeamRecent(teamId);
			logger.info("Listed team recent snippets", { items });
			return c.json({ items }, 200);
		}
		const membership = await prisma.teamMember.findFirst({ where: { userId: user.id } });
		if (!membership) return c.json({ items: [] }, 200);
		const items = await CodeShareService.listTeamRecent(membership.teamId);
		logger.info("Listed team recent snippets", { items });
		return c.json({ items }, 200);
	}

	static async getById(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const id = c.req.param("id");
		const item = await CodeShareService.getById(id);
		if (!item) {
			logger.error("Not Found");
			return c.json({ error: "Not Found" }, 404);
		}
		logger.info("Got snippet by id", { id, item });
		return c.json({ ver: 1, alg: CODE_SHARE_ALGORITHM, ...item, createdAt: item.createdAt.toISOString() }, 200);
	}

	static async listTeamByAuthor(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const teamId = c.req.param("teamId");
		const authorId = c.req.param("userId");
		const isMember = await prisma.teamMember.findFirst({ where: { teamId, userId: user.id } });
		if (!isMember) return c.json({ error: "Forbidden" }, 403);
		const items = await CodeShareService.listTeamByAuthor(teamId, authorId);
		logger.info("Listed team recent by author", { teamId, authorId });
		return c.json({ items }, 200);
	}

	static async listDmWith(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) {
			logger.error("Unauthorized");
			return c.json({ error: "Unauthorized" }, 401);
		}
		const otherUserId = c.req.param("userId");
		const items = await CodeShareService.listDmWith(user.id, otherUserId);
		logger.info("Listed DMs with user", { otherUserId });
		return c.json({ items }, 200);
	}

	static async realtimeConfig(c: Context) {
		const url = ENV.SUPABASE.URL ?? "";
		const anonKey = ENV.SUPABASE.ANON_KEY ?? "";
		return c.json({ url, anonKey, channel: "osmynt-recent-snippets" }, 200);
	}
}
