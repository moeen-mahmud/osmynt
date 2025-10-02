import type { Context } from "hono";
import { z } from "zod";
import prisma from "@/config/database.config";

export class CodeShareController {
	static async share(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) return c.json({ error: "Unauthorized" }, 401);
		const body = await c.req.json().catch(() => ({}));
		const schema = z.object({
			ciphertextB64u: z.string(),
			ivB64u: z.string(),
			aad: z.string().optional(),
			wrappedKeys: z.array(
				z.object({
					recipientUserId: z.string(),
					recipientDeviceId: z.string(),
					senderEphemeralPublicKeyJwk: z.any(),
					wrappedCekB64u: z.string(),
				})
			),
			metadata: z.object({ teamId: z.string().optional() }).optional(),
		});
		const parsed = schema.safeParse(body);
		if (!parsed.success) return c.json({ error: "Invalid body" }, 400);
		const created = await prisma.codeShare.create({
			data: {
				authorId: user.id,
				ciphertextB64u: parsed.data.ciphertextB64u,
				ivB64u: parsed.data.ivB64u,
				aad: parsed.data.aad ?? null,
				wrappedKeys: parsed.data.wrappedKeys as unknown as object,
				metadata: parsed.data.metadata as unknown as object,
			},
		});
		// broadcast via supabase realtime (if configured in env)
		try {
			const { supabase } = await import("@/config/supabase.config");
			await supabase.channel("osmynt-recent-snippets").send({
				type: "broadcast",
				event: "snippet:created",
				payload: { id: created.id, title: (parsed.data.metadata as any)?.title },
			} as any);
		} catch {}
		return c.json({ id: created.id });
	}

	static async listTeam(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) return c.json({ error: "Unauthorized" }, 401);
		// infer team by membership; list recent items
		const membership = await prisma.teamMember.findFirst({ where: { userId: user.id } });
		if (!membership) return c.json({ items: [] });
		const items = await prisma.codeShare.findMany({
			where: { metadata: { path: ["teamId"], equals: membership.teamId } as any },
			orderBy: { createdAt: "desc" },
			take: 50,
			select: { id: true, createdAt: true, authorId: true, metadata: true },
		});
		return c.json({ items: items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })) });
	}

	static async getById(c: Context) {
		const user = c.get("user") as { id: string } | undefined;
		if (!user) return c.json({ error: "Unauthorized" });
		const id = c.req.param("id");
		const item = await prisma.codeShare.findUnique({
			where: { id },
			select: {
				id: true,
				authorId: true,
				createdAt: true,
				ciphertextB64u: true,
				ivB64u: true,
				aad: true,
				wrappedKeys: true,
				metadata: true,
			},
		});
		if (!item) return c.json({ error: "Not Found" });
		return c.json({ ...item, createdAt: item.createdAt.toISOString() });
	}
}
