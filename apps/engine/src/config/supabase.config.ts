import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/config/env.config";

if (!ENV.isConfigValid()) {
	console.error("Required environment variables are not properly defined");
	process.exit(1);
}

export const supabase = createClient(ENV.SUPABASE.URL!, ENV.SUPABASE.SERVICE_ROLE_KEY!, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});
