import { ENV } from "@/config/env.config";
import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

export async function jwtMiddleware(c: Context, next: Next) {
	if (!ENV.JWT_SECRET) {
		return c.json({ error: "JWT secret is not configured" }, 500);
	}
	return await jwt({
		secret: ENV.JWT_SECRET,
	})(c, next);
}
