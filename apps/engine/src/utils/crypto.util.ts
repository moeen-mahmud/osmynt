// ECDH P-256 + AES-GCM helpers for handshake encryption

export type HandshakeKeyMaterial = {
	serverPublicKeyJwk: JsonWebKey;
	serverPrivateKeyJwk: JsonWebKey;
};

export async function generateServerKeyPairP256(): Promise<HandshakeKeyMaterial> {
	const keyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
		"deriveKey",
		"deriveBits",
	]);
	const serverPublicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
	const serverPrivateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
	return { serverPublicKeyJwk, serverPrivateKeyJwk };
}

export async function importEcPublicKeyFromJwk(jwk: JsonWebKey): Promise<CryptoKey> {
	return crypto.subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, true, []);
}

export async function importEcPrivateKeyFromJwk(jwk: JsonWebKey): Promise<CryptoKey> {
	return crypto.subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, true, [
		"deriveKey",
		"deriveBits",
	]);
}

export async function deriveAesGcmKey(serverPrivateKey: CryptoKey, clientPublicKey: CryptoKey): Promise<CryptoKey> {
	return crypto.subtle.deriveKey(
		{ name: "ECDH", public: clientPublicKey },
		serverPrivateKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

export function b64urlEncode(data: ArrayBuffer | Uint8Array | string): string {
	const bytes =
		typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data as ArrayBuffer | Uint8Array);
	const base64 = Buffer.from(bytes).toString("base64");
	return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function b64urlDecodeToUint8Array(input: string): Uint8Array {
	const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
	return new Uint8Array(Buffer.from(padded, "base64"));
}

export async function aesGcmEncryptJson(
	key: CryptoKey,
	data: unknown
): Promise<{ ivB64u: string; ciphertextB64u: string }> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const plaintext = new TextEncoder().encode(JSON.stringify(data));
	const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
	return { ivB64u: b64urlEncode(iv), ciphertextB64u: b64urlEncode(ciphertext) };
}
