import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import {
	route_authGithubAuthorize,
	route_authLoginWithToken,
	route_authHandshakeRetrieve,
	route_authGithubCallback,
	route_authHandshakeInit,
	type AuthRoutes,
} from "@/modules/auth/routes/auth.route";
import { AuthController } from "@/modules/auth/controllers/auth.controller";

const AuthAPIModule = new OpenAPIHono<Env, AuthRoutes>();

AuthAPIModule.openapi(route_authGithubAuthorize, AuthController.githubAuthorize);
AuthAPIModule.openapi(route_authGithubCallback, AuthController.githubCallback);
AuthAPIModule.openapi(route_authHandshakeInit, AuthController.handshakeInit);
AuthAPIModule.openapi(route_authHandshakeRetrieve, AuthController.handshakeRetrieve);
AuthAPIModule.openapi(route_authLoginWithToken, AuthController.loginWithToken);

export { AuthAPIModule };
