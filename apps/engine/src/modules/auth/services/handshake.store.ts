import Redis from "ioredis";
import { ENV } from "@/config/env.config";
import { supabase } from "@/config/supabase.config";
import type { StoredHandshake } from "@/modules/auth/types/auth.types";

const redis = (() => {
	if (!ENV.REDIS.URL) return null as unknown as Redis;
	const opts: any = { tls: ENV.REDIS.TLS ? {} : undefined };
	return new Redis(ENV.REDIS.URL, opts);
})();

const KEY = (id: string) => `osmynt:hs:${id}`;

export const HandshakeStore = {
	async save(id: string, data: StoredHandshake, ttlMs: number): Promise<void> {
		if (redis) {
			const payload = JSON.stringify(data);
			// ioredis expects seconds for EX
			const ttlSeconds = Math.max(1, Math.floor(ttlMs / 1000));
			await redis.set(KEY(id), payload, "EX", ttlSeconds);
		}
		if (ENV.FEATURE_FLAGS.SAVE_HANDSHAKES_TO_STORAGE) {
			const content = JSON.stringify(data);
			await supabase.storage
				.from("handshakes")
				.upload(`${id}.json`, new Blob([content], { type: "application/json" }), {
					upsert: true,
					cacheControl: "0",
				});
		}
	},

	async get(id: string): Promise<StoredHandshake | null> {
		if (redis) {
			const raw = await redis.get(KEY(id));
			if (raw) return JSON.parse(raw) as StoredHandshake;
		}
		const { data, error } = await supabase.storage.from("handshakes").download(`${id}.json`);
		if (error) return null;
		const text = await data.text();
		return JSON.parse(text) as StoredHandshake;
	},
};
