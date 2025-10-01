import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";

export const route_authGithubAuthorize = createRoute({
	tags: ["Auth"],
	operationId: "authGithubAuthorize",
	method: "get",
	path: Routes.auth.github,
	responses: {
		200: {
			description: "Successfully get the github authorize url",
			content: {
				"application/json": {
					schema: z.object({
						url: z.string(),
					}),
				},
			},
		},
	},
});

export const route_authGithubCallback = createRoute({
	tags: ["Auth"],
	operationId: "authGithubCallback",
	method: "get",
	path: Routes.auth.callback,
	responses: {
		200: {
			description: "Successfully get the github callback url",
			content: {
				"application/json": {
					schema: z.union([
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
					]),
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
	},
});

export const route_authHandshakeInit = createRoute({
	tags: ["Auth"],
	operationId: "authHandshakeInit",
	method: "post",
	path: Routes.auth.handshakeInit,
	responses: {
		200: {
			description: "Successfully init the handshake",
			content: {
				"application/json": {
					schema: z.object({
						handshakeId: z.string(),
						expiresInMs: z.number(),
					}),
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
	},
});

export const route_authHandshakeRetrieve = createRoute({
	tags: ["Auth"],
	operationId: "authHandshakeRetrieve",
	method: "get",
	path: Routes.auth.handshakeRetrieve,
	responses: {
		200: {
			description: "Successfully retrieve the handshake",
			content: {
				"application/json": {
					schema: z.discriminatedUnion("ready", [
						z.object({ ready: z.literal(false) }),
						z.object({
							ready: z.literal(true),
							serverPublicKeyJwk: z.any(),
							payload: z.object({
								ivB64u: z.string(),
								ciphertextB64u: z.string(),
							}),
						}),
					]),
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
		404: {
			description: "Not Found",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
		410: {
			description: "Gone",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
	},
});

export const route_authLoginWithToken = createRoute({
	tags: ["Auth"],
	operationId: "authLoginWithToken",
	method: "post",
	path: Routes.auth.loginWithToken,
	responses: {
		200: {
			description: "Successfully login with token",
			content: {
				"application/json": {
					schema: z.object({
						serverPublicKeyJwk: z.any(),
						payload: z.object({
							ivB64u: z.string(),
							ciphertextB64u: z.string(),
						}),
					}),
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z.object({
						error: z.string(),
					}),
				},
			},
		},
	},
});

export type AuthRoutes = {
	authGithubAuthorize: typeof route_authGithubAuthorize;
	authGithubCallback: typeof route_authGithubCallback;
	authHandshakeInit: typeof route_authHandshakeInit;
	authHandshakeRetrieve: typeof route_authHandshakeRetrieve;
	authLoginWithToken: typeof route_authLoginWithToken;
};
