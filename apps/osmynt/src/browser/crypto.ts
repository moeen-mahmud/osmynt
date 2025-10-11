import { MockCrypto } from "./mock-crypto";

// Browser-compatible crypto implementation using Web Crypto API
export class BrowserCrypto {
	private subtle: Crypto["subtle"] | null = null;
	private isWebCryptoAvailable: boolean = false;
	private mockCrypto: MockCrypto;

	constructor() {
		// Check for Web Crypto API in different environments
		if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
			this.subtle = window.crypto.subtle;
			this.isWebCryptoAvailable = true;
		} else if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle) {
			this.subtle = globalThis.crypto.subtle;
			this.isWebCryptoAvailable = true;
		} else if (typeof crypto !== "undefined" && crypto.subtle) {
			this.subtle = crypto.subtle;
			this.isWebCryptoAvailable = true;
		} else {
			console.warn("Web Crypto API not available, using mock implementation");
			this.isWebCryptoAvailable = false;
		}

		// Initialize mock crypto as fallback
		this.mockCrypto = new MockCrypto();
	}

	async generateKey(algorithm: string, extractable: boolean, keyUsages: string[]): Promise<CryptoKeyPair> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.generateKey(algorithm, extractable, keyUsages);
		}
		const alg = this.parseAlgorithm(algorithm);
		return this.subtle.generateKey(alg, extractable, keyUsages as KeyUsage[]);
	}

	async importKey(
		format: string,
		keyData: any,
		algorithm: any,
		extractable: boolean,
		keyUsages: string[]
	): Promise<CryptoKey> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.importKey(format, keyData, algorithm, extractable, keyUsages);
		}
		return this.subtle.importKey(format, keyData, algorithm, extractable, keyUsages as KeyUsage[]);
	}

	async exportKey(format: string, key: CryptoKey): Promise<any> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.exportKey(format, key);
		}
		return this.subtle.exportKey(format, key);
	}

	async deriveKey(
		algorithm: any,
		baseKey: CryptoKey,
		derivedKeyType: any,
		extractable: boolean,
		keyUsages: string[]
	): Promise<CryptoKey> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);
		}
		return this.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages as KeyUsage[]);
	}

	async encrypt(algorithm: any, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.encrypt(algorithm, key, data);
		}
		return this.subtle.encrypt(algorithm, key, data);
	}

	async decrypt(algorithm: any, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.decrypt(algorithm, key, data);
		}
		return this.subtle.decrypt(algorithm, key, data);
	}

	async wrapKey(format: string, key: CryptoKey, wrappingKey: CryptoKey, wrapAlgorithm: any): Promise<ArrayBuffer> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.wrapKey(format, key, wrappingKey, wrapAlgorithm);
		}
		return this.subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm);
	}

	async unwrapKey(
		format: string,
		wrappedKey: BufferSource,
		unwrappingKey: CryptoKey,
		unwrapAlgorithm: any,
		unwrappedKeyAlgorithm: any,
		extractable: boolean,
		keyUsages: string[]
	): Promise<CryptoKey> {
		if (!this.isWebCryptoAvailable || !this.subtle) {
			return this.mockCrypto.unwrapKey(
				format,
				wrappedKey,
				unwrappingKey,
				unwrapAlgorithm,
				unwrappedKeyAlgorithm,
				extractable,
				keyUsages
			);
		}
		return this.subtle.unwrapKey(
			format,
			wrappedKey,
			unwrappingKey,
			unwrapAlgorithm,
			unwrappedKeyAlgorithm,
			extractable,
			keyUsages as KeyUsage[]
		);
	}

	private parseAlgorithm(algorithm: string): any {
		switch (algorithm) {
			case "ECDH":
				return { name: "ECDH", namedCurve: "P-256" };
			case "AES-GCM":
				return { name: "AES-GCM", length: 256 };
			default:
				throw new Error(`Unsupported algorithm: ${algorithm}`);
		}
	}

	// Utility methods for base64 encoding/decoding
	b64url(data: Uint8Array): string {
		return this.mockCrypto.b64url(data);
	}

	b64uToBytes(s: string): Uint8Array {
		return this.mockCrypto.b64uToBytes(s);
	}

	// Random bytes generation
	randomBytes(length: number): Uint8Array {
		if (
			this.isWebCryptoAvailable &&
			typeof window !== "undefined" &&
			window.crypto &&
			window.crypto.getRandomValues
		) {
			return window.crypto.getRandomValues(new Uint8Array(length));
		}
		return this.mockCrypto.randomBytes(length);
	}
}
