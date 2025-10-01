import Redis from "ioredis";
import { ENV } from "@/config/env.config";

const redis = (() => {
	if (!ENV.REDIS.URL) return null as unknown as Redis;
	const opts: any = { tls: ENV.REDIS.TLS ? {} : undefined };
	return new Redis(ENV.REDIS.URL, opts);
})();

const USER_KEYS = (userId: string) => `osmynt:keys:${userId}`; // set of deviceIds
const DEVICE_KEY = (userId: string, deviceId: string) => `osmynt:key:${userId}:${deviceId}`; // hash/json

export type DeviceKeyRecord = {
	userId: string;
	deviceId: string;
	encryptionPublicKeyJwk: unknown;
	signingPublicKeyJwk?: unknown;
	algorithm: string;
};

export const KeysStore = {
	async register(rec: DeviceKeyRecord): Promise<void> {
		if (!redis) throw new Error("Redis not configured");
		await redis.sadd(USER_KEYS(rec.userId), rec.deviceId);
		await redis.set(DEVICE_KEY(rec.userId, rec.deviceId), JSON.stringify(rec));
	},

	async listUser(userId: string): Promise<DeviceKeyRecord[]> {
		if (!redis) return [];
		const deviceIds = await redis.smembers(USER_KEYS(userId));
		const pipeline = redis.multi();
		for (const d of deviceIds) pipeline.get(DEVICE_KEY(userId, d));
		const results = (await pipeline.exec()) ?? [];
		const recs: DeviceKeyRecord[] = [];
		for (const [, val] of results as Array<[Error | null, string | null]>) {
			if (val) recs.push(JSON.parse(val));
		}
		return recs;
	},
};
