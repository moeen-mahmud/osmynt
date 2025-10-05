import { Routes } from "@/config/routes.config";
import { createRoute, z } from "@hono/zod-openapi";
import { TeamSchema, UserPublicSchema } from "@/schemas/models";

export const route_me = createRoute({
	tags: ["Teams"],
	operationId: "teamsMe",
	method: "get",
	path: Routes.teams.me,
	responses: {
		200: {
			description: "Current user's team and members",
			content: {
				"application/json": {
					schema: z.object({
						user: z.object({ id: z.string() }),
						teams: z.array(TeamSchema.pick({ id: true, name: true, slug: true, ownerId: true })),
						membersByTeam: z.record(z.string(), z.array(UserPublicSchema)),
					}),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		500: {
			description: "Internal server error",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_invite = createRoute({
	tags: ["Teams"],
	operationId: "teamsInvite",
	method: "post",
	path: Routes.teams.invite,
	responses: {
		200: {
			description: "Invitation created",
			content: {
				"application/json": {
					schema: z.object({ token: z.string() }),
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		500: {
			description: "Internal server error",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_accept = createRoute({
	tags: ["Teams"],
	operationId: "teamsAccept",
	method: "post",
	path: Routes.teams.accept,
	responses: {
		200: {
			description: "Joined",
			content: { "application/json": { schema: z.object({ ok: z.literal(true) }) } },
		},
		400: {
			description: "Invalid or expired",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		500: {
			description: "Internal server error",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export const route_removeTeamMember = createRoute({
	tags: ["Teams"],
	operationId: "teamsRemoveTeamMember",
	method: "delete",
	path: Routes.teams.removeTeamMember,
	responses: {
		200: {
			description: "Removed",
			content: { "application/json": { schema: z.object({ ok: z.boolean() }) } },
		},
		401: {
			description: "Unauthorized",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
		500: {
			description: "Internal server error",
			content: { "application/json": { schema: z.object({ error: z.string() }) } },
		},
	},
});

export type TeamsRoutes = {
	teamsMe: typeof route_me;
	teamsInvite: typeof route_invite;
	teamsAccept: typeof route_accept;
};
