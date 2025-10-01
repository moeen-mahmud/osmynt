import { Routes } from "@/config/routes.config";
import { rateLimitedMiddleware } from "@/middlewares/rate-limiter.middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { healthCheckMiddleware } from "@/middlewares/health-check.middleware";
import { cors } from "hono/cors";
import { Scalar } from "@scalar/hono-api-reference";
import type { Server } from "bun";
import { AuthAPIModule } from "@/modules/auth/auth.module";

const app = new OpenAPIHono<Env>().basePath(Routes.basePath);

// Global middlewares
app.use(rateLimitedMiddleware);
app.use(
	poweredBy({
		serverName: "Osmynt",
	})
);
app.use(logger());
app.use(healthCheckMiddleware);
app.use(
	"*",
	cors({
		origin: "*",
		allowHeaders: ["Content-Type"],
		credentials: true,
	})
);

// MAIN ENTRY ROUTE
app.get("/", c => {
	return c.json({ message: "Server is running F A S T 🔥" });
});
// Auth routes
app.route(Routes.auth.base, AuthAPIModule);
// app.get(`${Routes.auth.base}${Routes.auth.github}`, AuthController.githubAuthorize);

// app.get(`${Routes.auth.base}${Routes.auth.callback}`, AuthController.githubCallback);

// app.post(`${Routes.auth.base}${Routes.auth.handshakeInit}`, AuthController.handshakeInit);

// app.get(`${Routes.auth.base}${Routes.auth.handshakeRetrieve}`, AuthController.handshakeRetrieve);

// app.post(`${Routes.auth.base}${Routes.auth.loginWithToken}`, AuthController.loginWithToken);

// api reference
app.doc("/doc", {
	openapi: "3.0.0",
	security: [{ Bearer: [] }],
	info: {
		contact: {
			name: "Osmynt",
			email: "support@osmynt.com",
			url: "https://osmynt.com",
		},
		title: "Osmynt API Reference",
		description:
			"Welcome to Osmynt API Reference. This API reference provides the detailed information about all the endpoints available in Osmynt API.",
		version: "0.0.1",
	},
});
app.get(
	"/reference",
	Scalar({
		_integration: "hono",
		configuration: {
			authentication: {
				http: {
					scheme: "bearer",
				},
			},
		},
		darkMode: true,
		theme: "purple",
		spec: {
			url: `${Routes.basePath}${Routes.doc}`,
		},
		metaData: {
			title: "Osmynt API Reference",
		},
		customCss: `
			body { 
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
			}
		`,
	})
);

// main server
export default {
	port: 3000,
	fetch(req: Request, server: Server) {
		return app.fetch(req, { ip: server.requestIP(req), server });
	},
};
