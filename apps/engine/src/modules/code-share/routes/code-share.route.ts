import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";

export const route_share = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareShare",
	method: "post",
	path: Routes.codeShare.share,
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({
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
						metadata: z.object({ teamId: z.string().optional(), title: z.string().optional() }).optional(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Shared",
			// content: { "application/json": { schema: z.object({ id: z.string() }) } }
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

export const route_listTeam = createRoute({
	tags: ["CodeShare"],
	operationId: "codeShareListTeam",
	method: "get",
	path: Routes.codeShare.listTeam,
	responses: {
		200: {
			description: "List team ciphertexts",
			// content: {
			// 	"application/json": {
			// 		schema: z.object({
			// 			items: z.array(
			// 				z.object({
			// 					id: z.string(),
			// 					createdAt: z.string(),
			// 					authorId: z.string(),
			// 					metadata: z.any().optional(),
			// 				})
			// 			),
			// 		}),
			// 	},
			// },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
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
			// content: {
			//     "application/json": {
			//         schema: z.object({
			//             id: z.string(),
			//             authorId: z.string(),
			//             createdAt: z.string(),
			//             ciphertextB64u: z.string(),
			//             ivB64u: z.string(),
			//             aad: z.string().nullable().optional(),
			//             wrappedKeys: z.array(
			//                 z.object({
			//                     recipientUserId: z.string(),
			//                     recipientDeviceId: z.string(),
			//                     senderEphemeralPublicKeyJwk: z.any(),
			//                     wrappedCekB64u: z.string(),
			//                 })
			//             ),
			//             metadata: z.any().optional(),
			//         }),
			//     },
			// },
		},
		404: {
			description: "Not Found",
			// content: { "application/json": { schema: z.object({ error: z.string() }) } }
		},
		401: {
			description: "Unauthorized",
			// content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export type CodeShareRoutes = {
	codeShareShare: typeof route_share;
	codeShareListTeam: typeof route_listTeam;
	codeShareGetById: typeof route_getById;
};
