import Redis from "ioredis";
import { ENV } from "@/config/env.config";
import { supabase } from "@/config/supabase.config";
import type { StoredHandshake } from "@/modules/auth/types/auth.types";

type Backend = "redis" | "supabase" | "memory";

const backend: Backend = (() => {
	if (ENV.REDIS.URL) return "redis";
	if (ENV.FEATURE_FLAGS.SAVE_HANDSHAKES_TO_STORAGE) return "supabase";
	return "memory";
})();

const redis = (() => {
	if (backend !== "redis") return null as unknown as Redis;
	const opts: any = { tls: ENV.REDIS.TLS ? {} : undefined };
	return new Redis(ENV.REDIS.URL!, opts);
})();

const memory = new Map<string, { value: StoredHandshake; expiresAt: number }>();
const KEY = (id: string) => `osmynt:hs:${id}`;

export const HandshakeStore = {
	async save(id: string, data: StoredHandshake, ttlMs: number): Promise<void> {
		const payload = JSON.stringify(data);
		const ttlSeconds = Math.max(1, Math.floor(ttlMs / 1000));
		if (backend === "redis") {
			await redis.set(KEY(id), payload, "EX", ttlSeconds);
			return;
		}
		if (backend === "supabase") {
			await supabase.storage
				.from("handshakes")
				.upload(`${id}.json`, new Blob([payload], { type: "application/json" }), {
					upsert: true,
					cacheControl: "0",
				});
			return;
		}
		// memory
		memory.set(id, { value: data, expiresAt: Date.now() + ttlMs });
	},

	async get(id: string): Promise<StoredHandshake | null> {
		if (backend === "redis") {
			const raw = await redis.get(KEY(id));
			return raw ? (JSON.parse(raw) as StoredHandshake) : null;
		}
		if (backend === "supabase") {
			const { data, error } = await supabase.storage.from("handshakes").download(`${id}.json`);
			if (error) return null;
			const text = await data.text();
			return JSON.parse(text) as StoredHandshake;
		}
		// memory
		const rec = memory.get(id);
		if (!rec) return null;
		if (Date.now() > rec.expiresAt) {
			memory.delete(id);
			return null;
		}
		return rec.value;
	},
};
