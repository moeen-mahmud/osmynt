import prisma from "@/config/database.config";
import type { Context, Next } from "hono";

export const healthCheckMiddleware = async (c: Context, next: Next) => {
	const start = performance.now();
	const isConnected = await prisma
		.$connect()
		.then(() => true)
		.catch(() => false);
	if (!isConnected) {
		return c.json({ error: "Database connection failed" }, 500);
	}
	await next();
	const end = performance.now();

	// Use more precise performance.now() for timing in Bun
	const responseTime = (end - start).toFixed(2);
	c.res.headers.set("X-Response-Time", `${responseTime}ms`);
};
