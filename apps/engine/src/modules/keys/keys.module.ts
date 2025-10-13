import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { jwtMiddleware } from "@/middlewares/jwt.middleware";
import { KeysController } from "@/modules/keys/controllers/keys.controller";
import {
	route_keysMe,
	route_keysRegister,
	route_keysTeamDefault,
	route_keysTeamById,
	route_pairingInit,
	route_pairingClaim,
	route_deviceRemove,
	route_deviceForceRemove,
} from "@/modules/keys/routes/keys.route";

const KeysAPIModule = new OpenAPIHono<Env>();

KeysAPIModule.use("*", jwtMiddleware);
KeysAPIModule.openapi(route_keysRegister, KeysController.register);
KeysAPIModule.openapi(route_keysMe, KeysController.me);
KeysAPIModule.openapi(route_keysTeamDefault, KeysController.teamDefault);
KeysAPIModule.openapi(route_keysTeamById, KeysController.teamById);
KeysAPIModule.openapi(route_pairingInit, KeysController.pairingInit);
KeysAPIModule.openapi(route_pairingClaim, KeysController.pairingClaim);
KeysAPIModule.openapi(route_deviceRemove, KeysController.deviceRemove);
KeysAPIModule.openapi(route_deviceForceRemove, KeysController.deviceForceRemove);

export { KeysAPIModule };
