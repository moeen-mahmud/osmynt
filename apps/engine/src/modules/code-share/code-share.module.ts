import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { jwtMiddleware } from "@/middlewares/jwt.middleware";
import { CodeShareController } from "@/modules/code-share/controllers/code-share.controller";
import {
	route_getById,
	route_listTeam,
	route_share,
	route_listTeamByAuthor,
	type CodeShareRoutes,
} from "@/modules/code-share/routes/code-share.route";

const CodeShareAPIModule = new OpenAPIHono<Env, CodeShareRoutes>();

CodeShareAPIModule.use("*", jwtMiddleware);
CodeShareAPIModule.openapi(route_share, CodeShareController.share);
CodeShareAPIModule.openapi(route_listTeam, CodeShareController.listTeam);
CodeShareAPIModule.openapi(route_getById, CodeShareController.getById);
CodeShareAPIModule.openapi(route_listTeamByAuthor, CodeShareController.listTeamByAuthor);

export { CodeShareAPIModule };
