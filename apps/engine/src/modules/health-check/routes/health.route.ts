import { createRoute, z } from "@hono/zod-openapi";
import { Routes } from "@/config/routes.config";
import { HealthCheckSchema } from "@/modules/health-check/schemas/health-check.schema";

export const HealthCheckResponse = z
	.object({
		data: HealthCheckSchema,
	})
	.openapi({
		title: "HealthCheckResponse",
		description: "Health check response",
	});

export const route_healthCheck = createRoute({
	tags: ["Health Check"],
	method: "get",
	description: "Health check endpoint",
	path: Routes.health,
	responses: {
		200: {
			description: "Health check",
			content: {
				"application/json": {
					schema: HealthCheckResponse,
				},
			},
		},
		500: {
			description: "Health check failed",
			content: {
				"application/json": {
					schema: z
						.object({
							error: z.string(),
						})
						.openapi({
							example: {
								error: "Health check failed",
							},
						}),
				},
			},
		},
	},
});

export type HealthCheckRoutes = { healthCheckRoute: typeof route_healthCheck };
