import { HealthCheckService } from "@/modules/health-check/services/health-check.service";
import type { Context } from "hono";

export class HealthCheckController {
	static async getHealthStatus(c: Context) {
		try {
			const healthData = await HealthCheckService.getHealthStatus();
			return c.json({ data: healthData }, 200);
		} catch (error: any) {
			return c.json({ error: `"Failed to get health stats" ${error}` }, 500);
		}
	}
}
