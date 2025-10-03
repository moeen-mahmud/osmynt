import { z } from "@hono/zod-openapi";

export const keysRegisterSchema = z
	.object({
		deviceId: z.string(),
		encryptionPublicKeyJwk: z.any(),
		signingPublicKeyJwk: z.any().optional(),
		algorithm: z.string().default("ECDH-P-256"),
	})
	.openapi("KeysRegisterSchema");

export type KeysRegisterSchema = z.infer<typeof keysRegisterSchema>;
