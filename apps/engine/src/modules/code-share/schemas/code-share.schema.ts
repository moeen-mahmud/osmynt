import { z } from "@hono/zod-openapi";

export const codeShareSchema = z.object({
	ciphertextB64u: z.string(),
	ivB64u: z.string(),
	aad: z.string().optional(),
	wrappedKeys: z.array(
		z.object({
			recipientUserId: z.string(),
			recipientDeviceId: z.string(),
			senderEphemeralPublicKeyJwk: z.any(),
			wrappedCekB64u: z.string(),
			wrapIvB64u: z.string(),
		})
	),
	metadata: z
		.object({ teamId: z.string().optional(), title: z.string().min(1) })
		.loose()
		.optional(),
});

export const codeSharePayloadSchema = z.object({
	authorId: z.string(),
	ciphertextB64u: z.string(),
	ivB64u: z.string(),
	aad: z.string().optional(),
	wrappedKeys: z.any(),
	metadata: z.any().optional(),
});

export type CodeShareSchema = z.infer<typeof codeShareSchema>;
export type CodeSharePayloadSchema = z.infer<typeof codeSharePayloadSchema>;
