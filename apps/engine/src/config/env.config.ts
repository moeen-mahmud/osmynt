export const ENV = {
	PORT: Number.parseInt(Bun.env.PORT as string, 10) || 3000,
	HOST: Bun.env.HOST || "localhost",
	NODE_ENV: Bun.env.NODE_ENV || "development",

	JWT_SECRET: Bun.env.JWT_SECRET,

	GITHUB: {
		CLIENT_ID: Bun.env.GITHUB_CLIENT_ID,
		CLIENT_SECRET: Bun.env.GITHUB_CLIENT_SECRET,
		REDIRECT_URI: Bun.env.GITHUB_REDIRECT_URI,
	},

	REDIS: {
		URL: Bun.env.SUPABASE_REDIS_URL,
		TLS: (Bun.env.SUPABASE_REDIS_TLS ?? "true").toLowerCase() !== "false",
	},

	CORS_ORIGIN: Bun.env.CORS_ORIGIN,

	FEATURE_FLAGS: {
		SAVE_HANDSHAKES_TO_STORAGE: (Bun.env.SAVE_HANDSHAKES_TO_STORAGE ?? "true").toLowerCase() !== "false",
	},

	// Database configuration
	SUPABASE: {
		URL: Bun.env.SUPABASE_URL,
		SERVICE_ROLE_KEY: Bun.env.SUPABASE_SERVICE_ROLE_KEY,
		ANON_KEY: Bun.env.SUPABASE_ANON_KEY,
	},

	// Validation flag for environment variables
	isConfigValid: function () {
		const requiredVars = [
			this.SUPABASE.URL,
			this.SUPABASE.SERVICE_ROLE_KEY,
			this.GITHUB.CLIENT_ID,
			this.GITHUB.CLIENT_SECRET,
			this.JWT_SECRET,
		];

		return requiredVars.every(Boolean);
	},
};
