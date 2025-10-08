import prisma from "@/config/database.config";

export class KeysService {
	static async upsertDeviceKey(data: {
		userId: string;
		deviceId: string;
		encryptionPublicKeyJwk: unknown;
		signingPublicKeyJwk?: unknown;
		algorithm: string;
	}) {
		const existing = await prisma.deviceKey.findUnique({
			where: { userId_deviceId: { userId: data.userId, deviceId: data.deviceId } },
			select: { id: true },
		});
		if (!existing) {
			const count = await prisma.deviceKey.count({ where: { userId: data.userId } });
			if (count >= 2) {
				throw new Error("Device limit reached (2)");
			}
		}
		return prisma.deviceKey.upsert({
			where: { userId_deviceId: { userId: data.userId, deviceId: data.deviceId } },
			create: {
				userId: data.userId,
				deviceId: data.deviceId,
				encryptionPublicKeyJwk: data.encryptionPublicKeyJwk as unknown as object,
				signingPublicKeyJwk: (data.signingPublicKeyJwk as unknown as object) ?? undefined,
				algorithm: data.algorithm,
			},
			update: {
				encryptionPublicKeyJwk: data.encryptionPublicKeyJwk as unknown as object,
				signingPublicKeyJwk: (data.signingPublicKeyJwk as unknown as object) ?? undefined,
				algorithm: data.algorithm,
			},
		});
	}

	static async listUserDevices(userId: string) {
		return prisma.deviceKey.findMany({ where: { userId } });
	}

	static async listTeamRecipients(teamId: string) {
		const members = await prisma.teamMember.findMany({ where: { teamId } });
		const userIds = members.map(m => m.userId);
		const keys = await prisma.deviceKey.findMany({ where: { userId: { in: userIds } } });
		return keys.map(k => ({
			userId: k.userId,
			deviceId: k.deviceId,
			encryptionPublicKeyJwk: k.encryptionPublicKeyJwk as unknown as object,
			signingPublicKeyJwk: (k.signingPublicKeyJwk as unknown as object) ?? undefined,
		}));
	}
}
