export const ENV = {
	isDev: process.env.NODE_ENV === "development",
	engineBaseUrl: process.env.ENGINE_BASE_URL,
	supabaseUrl: process.env.SUPABASE_URL,
	supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
};
