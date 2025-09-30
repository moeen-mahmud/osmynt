import type { CookieOptions } from "hono/utils/cookie";

export const cookieOptions: CookieOptions = {
	path: "/",
	secure: true,
	httpOnly: true,
	sameSite: "lax",
};
