import { ENV } from "@/config/env.config";
import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

export async function jwtMiddleware(c: Context, next: Next) {
	return await jwt({
		secret: ENV.JWT_SECRET!,
	})(c, next);
}
