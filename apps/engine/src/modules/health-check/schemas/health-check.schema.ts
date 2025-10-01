import { HealthCheckStatus } from "@/modules/health-check/types/health-check.type";
import { z } from "@hono/zod-openapi";

export const HealthCheckSchema = z
	.object({
		status: z.enum([HealthCheckStatus.HEALTHY, HealthCheckStatus.UNHEALTHY]),
		timestamp: z.string(),
		uptime: z.number(),
		memoryUsage: z.object({
			heapUsed: z.number(),
			heapTotal: z.number(),
			external: z.number(),
		}),
		cpuUsage: z.object({
			user: z.number(),
			system: z.number(),
		}),
	})
	.openapi("HealthCheckSchema");
