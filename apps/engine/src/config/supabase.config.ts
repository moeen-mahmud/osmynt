import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
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
	realtime: {
		params: {
			eventsPerSecond: 3,
		},
	},
});

// Initialize the broadcast channel for snippets
let broadcastChannel: RealtimeChannel | null = null;

export async function getBroadcastChannel(): Promise<RealtimeChannel> {
	if (broadcastChannel && broadcastChannel.state === "joined") {
		return broadcastChannel;
	}

	// Create channel with self: true so sender also receives broadcasts
	broadcastChannel = supabase.channel("osmynt-recent-snippets", {
		config: {
			broadcast: { self: true },
		},
	});

	// Subscribe to the channel
	return new Promise((resolve, reject) => {
		broadcastChannel!.subscribe(status => {
			if (status === "SUBSCRIBED") {
				resolve(broadcastChannel!);
			} else if (status === "CHANNEL_ERROR") {
				reject(new Error("Failed to subscribe to broadcast channel"));
			}
		});
	});
}
