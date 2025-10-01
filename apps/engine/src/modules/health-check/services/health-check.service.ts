import { HealthCheckStatus, type THealthCheckSchema } from "@/modules/health-check/types/health-check.type";
import { logger } from "@osmynt-core/library";

export class HealthCheckService {
	static async getHealthStatus(): Promise<THealthCheckSchema> {
		try {
			const memory = process.memoryUsage();
			const healthData: THealthCheckSchema = {
				status: HealthCheckStatus.HEALTHY,
				timestamp: new Date().toISOString(),
				uptime: process.uptime(),
				memoryUsage: {
					heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
					heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
					external: Math.round(memory.external / 1024 / 1024),
				},
				cpuUsage: {
					system: process.cpuUsage().system,
					user: process.cpuUsage().user,
				},
			};
			logger.success("Health status retrieved successfully", { healthData });
			return healthData;
		} catch (error) {
			logger.error("Failed to get health status", { error });
			throw error;
		}
	}
}
