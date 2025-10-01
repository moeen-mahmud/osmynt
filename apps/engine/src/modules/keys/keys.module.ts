import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { jwtMiddleware } from "@/middlewares/jwt.middleware";
import { KeysController } from "@/modules/keys/controllers/keys.controller";
import { route_keysMe, route_keysRegister, route_keysTeamDefault, type KeysRoutes } from "@/modules/keys/routes/keys.route";

const KeysAPIModule = new OpenAPIHono<Env, KeysRoutes>();

KeysAPIModule.use("*", jwtMiddleware);
KeysAPIModule.openapi(route_keysRegister, KeysController.register);
KeysAPIModule.openapi(route_keysMe, KeysController.me);
KeysAPIModule.openapi(route_keysTeamDefault, KeysController.teamDefault);

export { KeysAPIModule };


