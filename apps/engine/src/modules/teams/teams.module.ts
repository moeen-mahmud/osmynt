import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { jwtMiddleware } from "@/middlewares/jwt.middleware";
import { TeamsController } from "@/modules/teams/controllers/teams.controller";
import { route_accept, route_invite, route_me, route_removeTeamMember } from "@/modules/teams/routes/teams.route";

const TeamsAPIModule = new OpenAPIHono<Env>();

TeamsAPIModule.use("*", jwtMiddleware);
TeamsAPIModule.openapi(route_me, TeamsController.me);
TeamsAPIModule.openapi(route_invite, TeamsController.invite);
TeamsAPIModule.openapi(route_accept, TeamsController.accept);
TeamsAPIModule.openapi(route_removeTeamMember, TeamsController.removeTeamMember);
export { TeamsAPIModule };
