export const ENV = {
	PORT: Number.parseInt(Bun.env.PORT as string, 10) || 3000,
	HOST: Bun.env.HOST || "localhost",
	NODE_ENV: Bun.env.NODE_ENV || "development",

	JWT_SECRET: Bun.env.JWT_SECRET,

	// Database configuration
	SUPABASE: {
		URL: Bun.env.SUPABASE_URL,
		SERVICE_ROLE_KEY: Bun.env.SUPABASE_SERVICE_ROLE_KEY,
		ANON_KEY: Bun.env.SUPABASE_ANON_KEY,
	},

	// Validation flag for environment variables
	isConfigValid: function () {
		const requiredVars = [this.SUPABASE.URL, this.SUPABASE.SERVICE_ROLE_KEY];

		return requiredVars.every(Boolean);
	},
};
