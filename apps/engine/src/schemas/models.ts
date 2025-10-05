import { z } from "@hono/zod-openapi";

export const TeamRoleSchema = z.enum(["OWNER", "MEMBER"]).openapi("TeamRole");

export const UserSchema = z
	.object({
		id: z.string(),
		githubId: z.string(),
		name: z.string(),
		email: z.string(),
		avatarUrl: z.string(),
		metadata: z.any(),
		createdAt: z.string().datetime().openapi({ example: new Date().toISOString() }),
		updatedAt: z.string().datetime().openapi({ example: new Date().toISOString() }),
	})
	.openapi("User");

export const UserPublicSchema = UserSchema.pick({ id: true, name: true, email: true, avatarUrl: true }).openapi(
	"UserPublic"
);

export const TeamSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		slug: z.string(),
		ownerId: z.string(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.openapi("Team");

export const TeamMemberSchema = z
	.object({
		id: z.string(),
		teamId: z.string(),
		userId: z.string(),
		role: TeamRoleSchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.openapi("TeamMember");

export const DeviceKeySchema = z
	.object({
		id: z.string(),
		userId: z.string(),
		deviceId: z.string(),
		encryptionPublicKeyJwk: z.any(),
		signingPublicKeyJwk: z.any().optional(),
		algorithm: z.string(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.openapi("DeviceKey");

export const DeviceKeyPublicSchema = DeviceKeySchema.pick({
	userId: true,
	deviceId: true,
	encryptionPublicKeyJwk: true,
	signingPublicKeyJwk: true,
}).openapi("DeviceKeyPublic");

export const DeviceKeySummarySchema = z
	.object({
		deviceId: z.string(),
		encryptionPublicKeyJwk: z.any(),
		signingPublicKeyJwk: z.any().optional(),
	})
	.openapi("DeviceKeySummary");

export const CodeShareModelSchema = z
	.object({
		id: z.string(),
		authorId: z.string(),
		ciphertextB64u: z.string(),
		ivB64u: z.string(),
		aad: z.string().nullable().optional(),
		wrappedKeys: z.any(),
		metadata: z.any(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.openapi("CodeShareModel");

export const CodeShareListItemSchema = z
	.object({
		id: z.string(),
		createdAt: z.string(),
		authorId: z.string(),
		authorName: z.string().default("").openapi({ example: "Jane Doe" }),
		metadata: z.any(),
	})
	.openapi("CodeShareListItem");

export const TeamInvitationSchema = z
	.object({
		id: z.string(),
		teamId: z.string(),
		inviterId: z.string(),
		token: z.string(),
		email: z.string().nullable().optional(),
		expiresAt: z.string().datetime(),
		createdAt: z.string().datetime(),
		acceptedAt: z.string().datetime().nullable().optional(),
	})
	.openapi("TeamInvitation");

export const AuditLogSchema = z
	.object({
		id: z.string(),
		action: z.string(),
		userId: z.string(),
		metadata: z.any(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.openapi("AuditLog");
