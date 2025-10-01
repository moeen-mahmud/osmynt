import type { Context, Next } from "hono";

export const scalarHeaderMiddleware = async (c: Context, next: Next) => {
	c.header("Content-Type", "text/html; charset=utf-8");
	c.header("Cache-Control", "no-cache, no-store, must-revalidate");
	c.header("Pragma", "no-cache");
	c.header("Expires", "0");
	await next();
};
