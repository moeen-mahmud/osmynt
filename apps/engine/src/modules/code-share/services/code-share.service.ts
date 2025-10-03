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
			select: { id: true, createdAt: true, authorId: true, metadata: true },
		});
		return items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() }));
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
}
