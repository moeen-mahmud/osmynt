import type { Context } from "hono";
import prisma from "@/config/database.config";
import { CodeShareService } from "@/modules/code-share/services/code-share.service";
import { logger } from "@osmynt-core/library";
import { codeShareSchema } from "@/modules/code-share/schemas/code-share.schema";
import { CODE_SHARE_ALGORITHM } from "@/modules/code-share/constants/code-share.constant";

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
		// broadcast via supabase realtime (if configured in env)
		try {
			const { supabase } = await import("@/config/supabase.config");
			await supabase.channel("osmynt-recent-snippets").send({
				type: "broadcast",
				event: "snippet:created",
				payload: { id: created.id, title: (parsed.data.metadata as any)?.title },
			} as any);
		} catch {
			logger.error("Failed to broadcast snippet:created");
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
		// infer team by membership; list recent items
		const membership = await prisma.teamMember.findFirst({ where: { userId: user.id } });
		if (!membership) {
			logger.error("No membership found");
			return c.json({ items: [] }, 200);
		}
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
}
