// Browser-compatible environment variables
let ENV: {
	ENGINE_BASE_URL: string;
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
	UPSTASH_REDIS_URL: string;
};

// Check if process.env is available (Node.js environment)
if (typeof process !== "undefined" && process.env) {
	ENV = {
		ENGINE_BASE_URL: process.env.ENGINE_BASE_URL || "http://localhost:3000",
		SUPABASE_URL: process.env.SUPABASE_URL || "",
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
		UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || "",
	};
} else {
	// Browser environment - use default values
	ENV = {
		ENGINE_BASE_URL: "http://localhost:3000",
		SUPABASE_URL: "",
		SUPABASE_ANON_KEY: "",
		UPSTASH_REDIS_URL: "",
	};
}

export { ENV };
