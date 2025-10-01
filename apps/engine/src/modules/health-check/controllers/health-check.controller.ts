import { HealthCheckService } from "@/modules/health-check/services/health-check.service";
import { logger, respondSuccess, respondError, respondInternalError } from "@osmynt-core/library";
import type { Context } from "hono";

export class HealthCheckController {
	static async getHealthStatus(c: Context) {
		try {
			const healthData = await HealthCheckService.getHealthStatus();
			logger.success("Health stats retrieved successfully", { healthData });
			return c.json({ data: healthData }, 200);
		} catch (error: any) {
			logger.error("Error getting health stats:", { error: error.message });
			return c.json({ error: "Failed to get health stats" }, 500);
		}
	}
}
