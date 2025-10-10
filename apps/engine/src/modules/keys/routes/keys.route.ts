import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";
import { DeviceKeySummarySchema } from "@/schemas/models";

export const route_keysRegister = createRoute({
	tags: ["Keys"],
	operationId: "keysRegister",
	summary: "Register a new device key",
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
	summary: "Get my device keys",
	method: "get",
	path: `${Routes.keys.me}`,
	responses: {
		200: {
			description: "My device keys",
			content: {
				"application/json": {
					schema: z.object({ devices: z.array(DeviceKeySummarySchema) }),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		403: {
			description: "Forbidden",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_keysTeamDefault = createRoute({
	tags: ["Keys"],
	operationId: "keysTeamDefault",
	summary: "Get default team members device keys",
	method: "get",
	path: `${Routes.keys.teamDefault}`,
	responses: {
		200: {
			description: "Default team members device keys",
			content: {
				"application/json": {
					schema: z.object({
						recipients: z.array(
							z.object({
								userId: z.string(),
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

export const route_keysTeamById = createRoute({
	tags: ["Keys"],
	operationId: "keysTeamById",
	summary: "Get team members device keys by teamId",
	method: "get",
	path: `${Routes.keys.teamById}`,
	responses: {
		200: {
			description: "Team members device keys by teamId",
			content: {
				"application/json": {
					schema: z.object({
						recipients: z.array(
							z.object({
								userId: z.string(),
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
		403: {
			description: "Forbidden",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_pairingInit = createRoute({
	tags: ["Keys"],
	operationId: "pairingInit",
	summary: "Initialize pairing",
	method: "post",
	path: `/pairing/init`,
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({
						deviceId: z.string(),
						ivB64u: z.string(),
						ciphertextB64u: z.string(),
						ttlMs: z
							.number()
							.int()
							.min(1000)
							.max(1000 * 60 * 10)
							.default(1000 * 60 * 5),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Pairing token created",
			content: { "application/json": { schema: z.object({ token: z.string() }) } },
		},
		400: {
			description: "Bad Request",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		403: {
			description: "Forbidden",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_pairingClaim = createRoute({
	tags: ["Keys"],
	operationId: "pairingClaim",
	summary: "Claim pairing",
	method: "post",
	path: `/pairing/claim`,
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({ token: z.string() }),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Encrypted payload for pairing",
			content: { "application/json": { schema: z.object({ ivB64u: z.string(), ciphertextB64u: z.string() }) } },
		},
		400: {
			description: "Bad Request",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		403: {
			description: "Forbidden",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		404: { description: "Not Found", content: { "application/json": { schema: z.object({ error: z.string() }) } } },
	},
});

export const route_deviceRemove = createRoute({
	tags: ["Keys"],
	operationId: "deviceRemove",
	summary: "Remove a device",
	method: "delete",
	path: `/device/:deviceId`,
	responses: {
		200: { description: "Removed", content: { "application/json": { schema: z.object({ ok: z.literal(true) }) } } },
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

export type KeysRoutes = {
	keysRegister: typeof route_keysRegister;
	keysMe: typeof route_keysMe;
	keysTeamDefault: typeof route_keysTeamDefault;
	keysTeamById: typeof route_keysTeamById;
	pairingInit: typeof route_pairingInit;
	pairingClaim: typeof route_pairingClaim;
	deviceRemove: typeof route_deviceRemove;
};
