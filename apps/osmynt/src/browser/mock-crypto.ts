// Mock crypto implementation for VS Code web extension environment
export class MockCrypto {
	constructor() {
		console.log("Using mock crypto implementation for VS Code web extension");
	}

	async generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): Promise<any> {
		console.log(`Mock: generateKey(${algorithm})`);
		// Return a mock key pair
		return {
			publicKey: { algorithm, type: "public" },
			privateKey: { algorithm, type: "private" },
		};
	}

	async importKey(
		format: string,
		keyData: any,
		algorithm: any,
		extractable: boolean,
		keyUsages: string[]
	): Promise<any> {
		console.log(`Mock: importKey(${format})`);
		return { algorithm, type: "secret" };
	}

	async exportKey(format: string, key: any): Promise<any> {
		console.log(`Mock: exportKey(${format})`);
		return { kty: "EC", crv: "P-256", x: "mock", y: "mock" };
	}

	async deriveKey(
		algorithm: any,
		baseKey: any,
		derivedKeyType: any,
		extractable: boolean,
		keyUsages: string[]
	): Promise<any> {
		console.log("Mock: deriveKey");
		return { algorithm: "AES-GCM", type: "secret" };
	}

	async encrypt(algorithm: any, key: any, data: any): Promise<ArrayBuffer> {
		console.log("Mock: encrypt");
		// Return mock encrypted data
		return new ArrayBuffer(32);
	}

	async decrypt(algorithm: any, key: any, data: any): Promise<ArrayBuffer> {
		console.log("Mock: decrypt");
		// Return mock decrypted data
		return new ArrayBuffer(32);
	}

	async wrapKey(format: string, key: any, wrappingKey: any, wrapAlgorithm: any): Promise<ArrayBuffer> {
		console.log("Mock: wrapKey");
		return new ArrayBuffer(32);
	}

	async unwrapKey(
		format: string,
		wrappedKey: any,
		unwrappingKey: any,
		unwrapAlgorithm: any,
		unwrappedKeyAlgorithm: any,
		extractable: boolean,
		keyUsages: string[]
	): Promise<any> {
		console.log("Mock: unwrapKey");
		return { algorithm: "AES-GCM", type: "secret" };
	}

	// Utility methods
	b64url(data: Uint8Array): string {
		return btoa(String.fromCharCode(...data))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=/g, "");
	}

	b64uToBytes(s: string): Uint8Array {
		const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
		return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
	}

	randomBytes(length: number): Uint8Array {
		// Use Math.random as fallback
		const bytes = new Uint8Array(length);
		for (let i = 0; i < length; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
		return bytes;
	}
}
