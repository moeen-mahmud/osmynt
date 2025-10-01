import type { z } from "@hono/zod-openapi";
import type { HealthCheckSchema } from "@/modules/health-check/schemas/health-check.schema";

export enum HealthCheckStatus {
	HEALTHY = "healthy",
	UNHEALTHY = "unhealthy",
}

export type THealthCheckSchema = z.infer<typeof HealthCheckSchema>;
