import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
import { ENV } from "@/config/env.config";
import { logger } from "@osmynt-core/library";

// Lazily initialize Supabase at runtime; do not exit process on missing envs
let supabaseClient: ReturnType<typeof createClient> | null = null;

function ensureSupabase() {
	if (supabaseClient) return supabaseClient;
	if (!ENV.SUPABASE.URL || !ENV.SUPABASE.ANON_KEY) {
		logger.warn("Supabase not configured; realtime features disabled");
		return null;
	}
	supabaseClient = createClient(ENV.SUPABASE.URL, ENV.SUPABASE.ANON_KEY, {
		auth: { autoRefreshToken: false, persistSession: false },
		realtime: { params: { self: true, eventsPerSecond: 3 } },
	});
	return supabaseClient;
}

// Initialize the broadcast channel for snippets
let broadcastChannel: RealtimeChannel | null = null;

export async function getBroadcastChannel(): Promise<RealtimeChannel> {
	const client = ensureSupabase();
	if (!client) {
		logger.error("Supabase not configured");
		throw new Error("Supabase not configured");
	}

	if (broadcastChannel && broadcastChannel.state === "joined") {
		return broadcastChannel;
	}

	// Create channel with self: true so sender also receives broadcasts
	broadcastChannel = client.channel("osmynt-recent-snippets", {
		config: { broadcast: { self: true } },
	});

	// Subscribe to the channel
	return new Promise((resolve, reject) => {
		broadcastChannel!.subscribe(status => {
			if (status === "SUBSCRIBED") {
				logger.info("Subscribed to broadcast channel");
				resolve(broadcastChannel!);
			} else if (status === "CHANNEL_ERROR") {
				logger.error("Failed to subscribe to broadcast channel");
				reject(new Error("Failed to subscribe to broadcast channel"));
			}
		});
	});
}
