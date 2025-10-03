import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";

export const route_keysRegister = createRoute({
	tags: ["Keys"],
	operationId: "keysRegister",
	method: "post",
	path: `${Routes.keys.register}`,
	request: {
		body: {
			content: {
				"application/json": {
					schema: z
						.object({
							deviceId: z.string(),
							encryptionPublicKeyJwk: z.any(),
							signingPublicKeyJwk: z.any().optional(),
							algorithm: z.string().default("ECDH-P-256"),
						})
						.openapi("KeysRegisterSchema"),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Registered",
			content: { "application/json": { schema: z.object({ ok: z.literal(true) }) } },
		},
		400: {
			description: "Bad Request",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_keysMe = createRoute({
	tags: ["Keys"],
	operationId: "keysMe",
	method: "get",
	path: `${Routes.keys.me}`,
	responses: {
		200: {
			description: "My device keys",
			content: {
				"application/json": {
					schema: z.object({
						devices: z.array(
							z.object({
								deviceId: z.string(),
								encryptionPublicKeyJwk: z.any(),
								signingPublicKeyJwk: z.any().optional(),
							})
						),
					}),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_keysTeamDefault = createRoute({
	tags: ["Keys"],
	operationId: "keysTeamDefault",
	method: "get",
	path: `${Routes.keys.teamDefault}`,
	responses: {
		200: {
			description: "Default team members device keys",
		},
	},
});

export const route_keysTeamById = createRoute({
	tags: ["Keys"],
	operationId: "keysTeamById",
	method: "get",
	path: `${Routes.keys.teamById}`,
	responses: {
		200: {
			description: "Team members device keys by teamId",
		},
		401: { description: "Unauthorized" },
		403: { description: "Forbidden" },
	},
});

export type KeysRoutes = {
	keysRegister: typeof route_keysRegister;
	keysMe: typeof route_keysMe;
	keysTeamDefault: typeof route_keysTeamDefault;
	keysTeamById: typeof route_keysTeamById;
};
