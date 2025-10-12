import Redis from "ioredis";
import { ENV } from "@/config/env.config";
import { OSMYNT_PAIR } from "@/config/constants";

type StoredPairing = {
	userId: string;
	ivB64u: string;
	ciphertextB64u: string;
	createdAt: number;
	expiresAt: number;
};

const KEY = (token: string) => `${OSMYNT_PAIR}:${token}`;

if (!ENV.REDIS.URL) {
	throw new Error("Pairing storage requires Redis. Set SUPABASE_REDIS_URL.");
}

const redis = new Redis(ENV.REDIS.URL!, { tls: ENV.REDIS.TLS ? {} : undefined } as any);

export const PairingStore = {
	async save(token: string, data: StoredPairing, ttlMs: number): Promise<void> {
		const payload = JSON.stringify(data);
		const ttlSeconds = Math.max(1, Math.floor(ttlMs / 1000));
		await redis.set(KEY(token), payload, "EX", ttlSeconds);
	},

	async get(token: string): Promise<StoredPairing | null> {
		const raw = await redis.get(KEY(token));
		return raw ? (JSON.parse(raw) as StoredPairing) : null;
	},

	async del(token: string): Promise<void> {
		await redis.del(KEY(token));
	},
};
