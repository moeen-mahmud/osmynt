import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";
import { CodeShareListItemSchema } from "@/schemas/models";
import { CODE_SHARE_ALGORITHM } from "@/modules/code-share/constants/code-share.constant";

export const route_share = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareShare",
	method: "post",
	path: Routes.codeShare.share,
	request: {
		body: {
			content: {
				"application/json": {
					schema: z
						.object({
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
							metadata: z.object({ teamId: z.string().optional(), title: z.string().min(1) }).optional(),
						})
						.openapi("CodeShareSchema"),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Shared",
			content: { "application/json": { schema: z.object({ id: z.string() }) } },
		},
		400: {
			description: "Bad Request",
		},
		401: {
			description: "Unauthorized",
		},
	},
});

export const route_listTeam = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareListTeam",
	method: "get",
	path: Routes.codeShare.listTeam,
	responses: {
		200: {
			description: "List team ciphertexts",
			content: {
				"application/json": {
					schema: z
						.object({ items: z.array(CodeShareListItemSchema.omit({ authorName: true })) })
						.openapi("ListTeamRecentSchema"),
				},
			},
		},
		401: {
			description: "Unauthorized",
		},
	},
});

export const route_getById = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareGetById",
	method: "get",
	path: Routes.codeShare.getById,
	responses: {
		200: {
			description: "Get item",
			content: {
				"application/json": {
					schema: z.object({
						ver: z.number().default(1),
						alg: z.string().default(CODE_SHARE_ALGORITHM),
						id: z.string(),
						authorId: z.string(),
						createdAt: z.string(),
						ciphertextB64u: z.string(),
						ivB64u: z.string(),
						aad: z.string().nullable().optional(),
						wrappedKeys: z.array(
							z.object({
								recipientUserId: z.string(),
								recipientDeviceId: z.string(),
								senderEphemeralPublicKeyJwk: z.any(),
								wrappedCekB64u: z.string(),
								wrapIvB64u: z.string(),
							})
						),
						metadata: z.any().optional(),
					}),
				},
			},
		},
		404: {
			description: "Not Found",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_addWrappedKeys = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareAddWrappedKeys",
	method: "post",
	path: "/:id/add-wrapped-keys",
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({
						wrappedKeys: z.array(
							z.object({
								recipientUserId: z.string(),
								recipientDeviceId: z.string(),
								senderEphemeralPublicKeyJwk: z.any(),
								wrappedCekB64u: z.string(),
								wrapIvB64u: z.string(),
							})
						),
					}),
				},
			},
		},
	},
	responses: {
		200: { description: "Updated", content: { "application/json": { schema: z.object({ ok: z.literal(true) }) } } },
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		403: { description: "Forbidden", content: { "application/json": { schema: z.object({ error: z.string() }) } } },
		404: { description: "Not Found", content: { "application/json": { schema: z.object({ error: z.string() }) } } },
	},
});

export const route_listTeamByAuthor = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareListTeamByAuthor",
	method: "get",
	// IMPORTANT: this route module is mounted at Routes.codeShare.base, so this path must be RELATIVE
	path: "/team/:teamId/by-author/:userId",
	responses: {
		200: {
			description: "List team ciphertexts by author",
			content: {
				"application/json": {
					schema: z.object({ items: z.array(CodeShareListItemSchema) }),
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

export const route_listDmWith = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareListDmWith",
	method: "get",
	path: "/dm/with/:userId",
	responses: {
		200: {
			description: "List direct messages with a user",
			content: {
				"application/json": {
					schema: z.object({ items: z.array(CodeShareListItemSchema) }),
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

export const route_realtimeConfig = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareRealtimeConfig",
	method: "get",
	path: "/realtime-config",
	responses: {
		200: {
			description: "Realtime config (public anon)",
			content: {
				"application/json": { schema: z.object({ url: z.string(), anonKey: z.string(), channel: z.string() }) },
			},
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export type CodeShareRoutes = {
	codeShareShare: typeof route_share;
	codeShareListTeam: typeof route_listTeam;
	codeShareGetById: typeof route_getById;
	codeShareAddWrappedKeys: typeof route_addWrappedKeys;
	codeShareListTeamByAuthor: typeof route_listTeamByAuthor;
	codeShareListDmWith: typeof route_listDmWith;
	codeShareRealtimeConfig: typeof route_realtimeConfig;
};
