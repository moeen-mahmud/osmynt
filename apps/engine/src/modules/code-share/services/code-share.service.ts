import prisma from "@/config/database.config";
import type { CodeSharePayloadSchema } from "@/modules/code-share/schemas/code-share.schema";

export class CodeShareService {
	static async share(data: CodeSharePayloadSchema) {
		return prisma.codeShare.create({
			data: {
				authorId: data.authorId,
				ciphertextB64u: data.ciphertextB64u,
				ivB64u: data.ivB64u,
				aad: data.aad ?? null,
				wrappedKeys: data.wrappedKeys as unknown as object,
				metadata: data.metadata as unknown as object,
			},
		});
	}

	static async listTeamRecent(teamId: string, take = 50) {
		const items = await prisma.codeShare.findMany({
			where: { metadata: { path: ["teamId"], equals: teamId } as any },
			orderBy: { createdAt: "desc" },
			take,
			select: {
				id: true,
				createdAt: true,
				authorId: true,
				metadata: true,
				wrappedKeys: true,
				Author: { select: { name: true } },
			},
		});
		return items.map(i => ({
			id: i.id,
			createdAt: i.createdAt.toISOString(),
			authorId: i.authorId,
			authorName: i.Author?.name ?? "",
			metadata: i.metadata,
			wrappedKeys: i.wrappedKeys,
		}));
	}
	static async listDmWith(currentUserId: string, otherUserId: string, take = 50) {
		const items = await prisma.codeShare.findMany({
			// Fetch recent items; filtering for DM semantics is done in application code for portability
			orderBy: { createdAt: "desc" },
			take,
			select: {
				id: true,
				createdAt: true,
				authorId: true,
				metadata: true,
				wrappedKeys: true,
				Author: { select: { name: true } },
			},
		});
		// Filter in application because JSON array search portable across DBs is limited
		const filtered = items.filter(i => {
			const wk = (i.wrappedKeys as unknown as Array<any>) || [];
			const isDm = !(i.metadata as any)?.teamId;
			const hasMe = wk.some(e => e?.recipientUserId === currentUserId);
			const hasOther = wk.some(e => e?.recipientUserId === otherUserId);
			return isDm && hasMe && hasOther;
		});
		return filtered.map(i => ({
			id: i.id,
			createdAt: i.createdAt.toISOString(),
			authorId: i.authorId,
			authorName: (i as any).Author?.name ?? "",
			metadata: i.metadata,
		}));
	}

	static async getById(id: string) {
		return prisma.codeShare.findUnique({
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
	}

	static async listTeamByAuthor(teamId: string, userId: string, take = 50) {
		const items = await prisma.codeShare.findMany({
			where: { authorId: userId, metadata: { path: ["teamId"], equals: teamId } as any },
			orderBy: { createdAt: "desc" },
			take,
			select: { id: true, createdAt: true, authorId: true, metadata: true, Author: { select: { name: true } } },
		});
		return items.map(i => ({
			id: i.id,
			createdAt: i.createdAt.toISOString(),
			authorId: i.authorId,
			authorName: i.Author?.name ?? "",
			metadata: i.metadata,
		}));
	}
}
