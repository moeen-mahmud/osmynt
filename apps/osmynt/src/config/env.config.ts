export const ENV = {
	isDev: process.env.NODE_ENV === "development",
	engineBaseUrl: process.env.ENGINE_BASE_URL,
	upstashRedisUrl: process.env.UPSTASH_REDIS_URL,
};
