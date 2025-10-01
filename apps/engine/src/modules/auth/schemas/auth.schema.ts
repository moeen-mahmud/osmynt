import { z } from "@hono/zod-openapi";

export const authGithubAuthorizeSchema = z
	.object({
		url: z.string(),
	})
	.openapi({
		example: {
			url: "https://github.com/login/oauth/authorize?client_id=1234567890&redirect_uri=http://localhost:3000/auth/github/callback&scope=user:email",
		},
	});

export const authGithubCallbackSchema = z
	.union([
		z.object({
			user: z.object({
				id: z.string(),
				email: z.string(),
				name: z.string(),
				avatarUrl: z.string(),
			}),
			tokens: z.object({
				access: z.string(),
				refresh: z.string(),
			}),
		}),
		z.object({
			ok: z.literal(true),
			handshakeId: z.string(),
			serverPublicKeyJwk: z.any(),
		}),
	])
	.openapi({
		example: {
			user: {
				id: "1234567890",
				email: "test@test.com",
				name: "Test User",
				avatarUrl: "https://test.com/avatar.png",
			},
		},
	});

export const authHandshakeInitSchema = z
	.object({
		handshakeId: z.string(),
		expiresInMs: z.number(),
	})
	.openapi({
		example: {
			handshakeId: "1234567890",
			expiresInMs: 1000 * 60 * 60 * 24,
		},
	});

export const authHandshakeRetrieveSchema = z.discriminatedUnion("ready", [
	z.object({ ready: z.literal(false) }),
	z
		.object({
			ready: z.literal(true),
			serverPublicKeyJwk: z.any(),
			payload: z.object({
				ivB64u: z.string(),
				ciphertextB64u: z.string(),
			}),
		})
		.openapi({
			example: {
				ready: false,
			},
		})
		.openapi({
			example: {
				ready: true,
				serverPublicKeyJwk: "1234567890",
				payload: {
					ivB64u: "1234567890",
					ciphertextB64u: "1234567890",
				},
			},
		}),
]);

export const authLoginWithTokenSchema = z
	.object({
		serverPublicKeyJwk: z.any(),
		payload: z.object({
			ivB64u: z.string(),
			ciphertextB64u: z.string(),
		}),
	})
	.openapi({
		example: {
			serverPublicKeyJwk: "1234567890",
			payload: {
				ivB64u: "1234567890",
				ciphertextB64u: "1234567890",
			},
		},
	});
