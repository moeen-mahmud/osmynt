import { ENV } from "@/config/env.config";

export const REALTIME_CHANNEL = "osmynt-recent-snippets";

export async function publishBroadcast(event: string, payload: unknown) {
	const url = `${ENV.UPSTASH?.REST_URL}/publish/${encodeURIComponent(REALTIME_CHANNEL)}`;
	const body = JSON.stringify({ event, payload });
	await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${ENV.UPSTASH?.REST_TOKEN}`,
			"Content-Type": "text/plain",
		},
		body,
	}).catch(() => {});
}
