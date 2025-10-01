import { ENV } from "@/config/env.config";
import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import prisma from "@/config/database.config";
import type { User } from "@osmynt-core/database";

type JwtContextVars = {
	jwtPayload: { sub?: string };
	user: User;
};

export async function jwtMiddleware(c: Context<{ Variables: JwtContextVars }>, next: Next) {
	if (!ENV.JWT_SECRET) {
		return c.json({ error: "JWT secret is not configured" }, 500);
	}
	await jwt({ secret: ENV.JWT_SECRET })(c, async () => {
		const payload = c.get("jwtPayload");
		if (!payload?.sub) {
			await c.json({ error: "Unauthorized" }, 401);
			return;
		}
		const user = await prisma.user.findUnique({ where: { id: payload.sub } });
		if (!user) {
			await c.json({ error: "Unauthorized" }, 401);
			return;
		}
		c.set("user", user as User);
		await next();
	});
}
