import Redis from "ioredis";
import { ENV } from "@/config/env.config";
import type { StoredHandshake } from "@/modules/auth/types/auth.types";

const KEY = (id: string) => `osmynt:hs:${id}`;

// Enforce Redis-only backend for handshake storage
if (!ENV.REDIS.URL) {
	throw new Error("Handshake storage requires Redis. Set SUPABASE_REDIS_URL.");
}

const redis = new Redis(ENV.REDIS.URL!, { tls: ENV.REDIS.TLS ? {} : undefined } as any);

export const HandshakeStore = {
	async save(id: string, data: StoredHandshake, ttlMs: number): Promise<void> {
		// Defensive: strip private key if somehow present
		const { serverPrivateKeyJwk, ...rest } = data as any;
		const payload = JSON.stringify(rest as StoredHandshake);
		const ttlSeconds = Math.max(1, Math.floor(ttlMs / 1000));
		await redis.set(KEY(id), payload, "EX", ttlSeconds);
	},

	async get(id: string): Promise<StoredHandshake | null> {
		const raw = await redis.get(KEY(id));
		return raw ? (JSON.parse(raw) as StoredHandshake) : null;
	},
};
