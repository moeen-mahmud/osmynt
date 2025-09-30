// Lightweight HS256 JWT signer using Web Crypto (Bun runtime)

type JwtHeader = {
	alg: "HS256";
	typ: "JWT";
};

function base64UrlEncode(input: ArrayBuffer | string): string {
	const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
	const str = Buffer.from(bytes).toString("base64");
	return str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function signJwtHS256(
	payload: Record<string, unknown>,
	secret: string,
	expiresInSeconds: number
): Promise<string> {
	const header: JwtHeader = { alg: "HS256", typ: "JWT" };
	const now = Math.floor(Date.now() / 1000);
	const body = { iat: now, exp: now + expiresInSeconds, ...payload };

	const headerPart = base64UrlEncode(JSON.stringify(header));
	const payloadPart = base64UrlEncode(JSON.stringify(body));
	const data = `${headerPart}.${payloadPart}`;

	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
	const signaturePart = base64UrlEncode(signature);
	return `${data}.${signaturePart}`;
}
