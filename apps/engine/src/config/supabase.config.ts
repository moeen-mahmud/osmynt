import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
import { ENV } from "@/config/env.config";
import { logger } from "@osmynt-core/library";
import { SUPABASE_CHANNEL_ERROR, SUPABASE_CHANNEL_SUBSCRIBED } from "@/config/constants";

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

	broadcastChannel = client.channel("osmynt-recent-snippets", {
		config: { broadcast: { self: true, ack: true } },
	});

	return new Promise((resolve, reject) => {
		broadcastChannel!.subscribe(status => {
			if (status === SUPABASE_CHANNEL_SUBSCRIBED) {
				logger.info("Subscribed to broadcast channel");
				resolve(broadcastChannel!);
			} else if (status === SUPABASE_CHANNEL_ERROR) {
				logger.error("Failed to subscribe to broadcast channel");
				reject(new Error("Failed to subscribe to broadcast channel"));
			}
		});
	});
}
