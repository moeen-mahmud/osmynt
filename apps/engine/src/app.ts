import { Routes } from "@/config/routes.config";
import { rateLimitedMiddleware } from "@/middlewares/rate-limiter.middleware";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { healthCheckMiddleware } from "@/middlewares/health-check.middleware";
import { cors } from "hono/cors";

import type { Server } from "bun";
import { AuthAPIModule } from "@/modules/auth/auth.module";
import { KeysAPIModule } from "@/modules/keys/keys.module";
import { CodeShareAPIModule } from "@/modules/code-share/code-share.module";
import { respondSuccess } from "@osmynt-core/library";
import { API_DOC_CONFIG } from "@/config/api-doc.config";
import { scalarHeaderMiddleware } from "@/middlewares/scalar.middleware";
import { scalarConfig } from "@/config/scalar.config";
import { HealthCheckAPIModule } from "@/modules/health-check/health-check.module";

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
	return respondSuccess(
		c,
		{
			status: "running",
			timestamp: new Date().toISOString(),
			version: "1.0.0",
		},
		"Server is running F A S T 🔥"
	);
});

// API DOC ROUTES
app.doc(Routes.doc, API_DOC_CONFIG);

// SCALAR ROUTES
app.use(Routes.reference, scalarHeaderMiddleware);
app.get(Routes.reference, scalarConfig);

// Health check routes
app.route(Routes.health, HealthCheckAPIModule);

// Auth routes
app.route(Routes.auth.base, AuthAPIModule);
app.route(Routes.keys.base, KeysAPIModule);
app.route(Routes.codeShare.base, CodeShareAPIModule);

// main server
export default {
	port: 3000,
	fetch(req: Request, server: Server) {
		return app.fetch(req, { ip: server.requestIP(req), server });
	},
};
