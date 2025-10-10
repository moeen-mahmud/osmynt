import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";
import {
	authGithubAuthorizeSchema,
	authGithubCallbackSchema,
	authHandshakeInitSchema,
	authHandshakeRetrieveSchema,
	authLoginWithTokenSchema,
} from "@/modules/auth/schemas/auth.schema";

export const route_authGithubAuthorize = createRoute({
	tags: ["Auth"],
	operationId: "authGithubAuthorize",
	summary: "Authorize with github",
	method: "get",
	path: Routes.auth.github,
	responses: {
		200: {
			description: "Successfully get the github authorize url",
			content: {
				"application/json": {
					schema: authGithubAuthorizeSchema,
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
	summary: "Callback from github",
	responses: {
		200: {
			description: "Successfully get the github callback url",
			content: {
				"application/json": {
					schema: authGithubCallbackSchema,
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Bad Request",
							},
						}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Internal Server Error",
							},
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
	summary: "Initialize handshake",
	responses: {
		200: {
			description: "Successfully init the handshake",
			content: {
				"application/json": {
					schema: authHandshakeInitSchema,
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Bad Request",
							},
						}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Internal Server Error",
							},
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
	summary: "Retrieve handshake",
	responses: {
		200: {
			description: "Successfully retrieve the handshake",
			content: {
				"application/json": {
					schema: authHandshakeRetrieveSchema,
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Bad Request",
							},
						}),
				},
			},
		},
		404: {
			description: "Not Found",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Not Found",
							},
						}),
				},
			},
		},
		410: {
			description: "Gone",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Gone",
							},
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
	summary: "Login with token",
	responses: {
		200: {
			description: "Successfully login with token",
			content: {
				"application/json": {
					schema: authLoginWithTokenSchema,
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Bad Request",
							},
						}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Internal Server Error",
							},
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
