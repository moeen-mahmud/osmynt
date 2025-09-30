import { rateLimiter } from "hono-rate-limiter";
import { nanoid } from "nanoid";

export const rateLimitedMiddleware = rateLimiter({
	windowMs: 1000 * 60 * 10, // 10 minutes
	limit: 100,
	standardHeaders: "draft-6",
	message: "Too many requests, please try again later.",
	keyGenerator: () => nanoid(),
});
