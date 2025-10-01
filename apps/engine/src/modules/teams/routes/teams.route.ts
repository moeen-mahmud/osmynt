import { Routes } from "@/config/routes.config";
import { createRoute } from "@hono/zod-openapi";

export const route_me = createRoute({
	tags: ["Teams"],
	operationId: "teamsMe",
	method: "get",
	path: Routes.teams.me,
	responses: {
		200: {
			description: "Current user's team and members", 
		},
	},
});

export const route_invite = createRoute({
	tags: ["Teams"],
	operationId: "teamsInvite",
	method: "post",
	path: Routes.teams.invite,
	responses: { 200: { description: "Invitation created" } },
});

export const route_accept = createRoute({
	tags: ["Teams"],
	operationId: "teamsAccept",
	method: "post",
	path: Routes.teams.accept,
	responses: { 200: { description: "Joined" } },
});

export type TeamsRoutes = {
	teamsMe: typeof route_me;
	teamsInvite: typeof route_invite;
	teamsAccept: typeof route_accept;
};
