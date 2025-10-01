import { HealthCheckController } from "@/modules/health-check/controllers/health-check.controller";
import { route_healthCheck, type HealthCheckRoutes } from "@/modules/health-check/routes/health.route";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";

const HealthCheckAPIModule = new OpenAPIHono<Env, HealthCheckRoutes>();

HealthCheckAPIModule.openapi(route_healthCheck, HealthCheckController.getHealthStatus);

export { HealthCheckAPIModule };
