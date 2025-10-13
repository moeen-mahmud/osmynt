import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { jwtMiddleware } from "@/middlewares/jwt.middleware";
import { CodeShareController } from "@/modules/code-share/controllers/code-share.controller";
import {
	route_getById,
	route_listTeam,
	route_share,
	route_listTeamByAuthor,
	route_listDmWith,
	// route_realtimeConfig,
	route_addWrappedKeys,
	type CodeShareRoutes,
} from "@/modules/code-share/routes/code-share.route";

const CodeShareAPIModule = new OpenAPIHono<Env, CodeShareRoutes>();

CodeShareAPIModule.use("*", jwtMiddleware);
CodeShareAPIModule.openapi(route_share, CodeShareController.share);
CodeShareAPIModule.openapi(route_listTeam, CodeShareController.listTeam);
CodeShareAPIModule.openapi(route_getById, CodeShareController.getById as any); // just for this one :)
CodeShareAPIModule.openapi(route_addWrappedKeys, CodeShareController.addWrappedKeys);
CodeShareAPIModule.openapi(route_listTeamByAuthor, CodeShareController.listTeamByAuthor);
CodeShareAPIModule.openapi(route_listDmWith, CodeShareController.listDmWith);
// CodeShareAPIModule.openapi(route_realtimeConfig, CodeShareController.realtimeConfig);

export { CodeShareAPIModule };
