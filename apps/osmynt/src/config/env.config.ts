export const ENV = {
	isDev: process.env.NODE_ENV === "development",
	engineBaseUrl: process.env.ENGINE_BASE_URL,
	// Upstash Redis (subscriber)
	upstashRedisUrl: process.env.UPSTASH_REDIS_URL,
};
