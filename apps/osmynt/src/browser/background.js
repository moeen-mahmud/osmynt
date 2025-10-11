// Browser extension background script
class OsmyntBackground {
	constructor() {
		this.init();
	}

	init() {
		// Listen for messages from popup and content scripts
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			this.handleMessage(request, sender, sendResponse);
			return true; // Keep the message channel open for async responses
		});

		// Handle OAuth redirect
		chrome.identity.onSignInChanged.addListener((account, signedIn) => {
			if (signedIn) {
				this.handleOAuthSuccess(account);
			}
		});
	}

	async handleMessage(request, sender, sendResponse) {
		try {
			switch (request.action) {
				case "shareCode":
					await this.shareCode(request.code, request.title);
					sendResponse({ success: true });
					break;

				case "getSnippets": {
					const snippets = await this.getSnippets();
					sendResponse({ success: true, snippets });
					break;
				}

				case "viewSnippet": {
					const content = await this.viewSnippet(request.snippetId);
					sendResponse({ success: true, content });
					break;
				}

				default:
					sendResponse({ success: false, error: "Unknown action" });
			}
		} catch (error) {
			console.error("Background script error:", error);
			sendResponse({ success: false, error: error.message });
		}
	}

	async shareCode(code, title) {
		const { base, access } = await this.getBaseAndAccess();

		// Get recipients for the team
		const recipientsRes = await fetch(`${base}/api/protected/keys/team/default`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const recipientsData = await recipientsRes.json();
		const recipients = Array.isArray(recipientsData?.recipients) ? recipientsData.recipients : [];

		if (recipients.length === 0) {
			throw new Error("No recipients found");
		}

		// Encrypt content using Web Crypto API
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const cekRaw = crypto.getRandomValues(new Uint8Array(32));
		const cek = await crypto.subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, true, [
			"encrypt",
			"wrapKey",
		]);
		const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cek, new TextEncoder().encode(code));

		// Create wrapped keys for recipients
		const wrappedKeys = [];
		const eph = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
			"deriveKey",
			"deriveBits",
		]);
		const ephPubJwk = await crypto.subtle.exportKey("jwk", eph.publicKey);

		for (const recipient of recipients) {
			const recipientPub = await crypto.subtle.importKey(
				"jwk",
				recipient.encryptionPublicKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				[]
			);
			const kek = await crypto.subtle.deriveKey(
				{ name: "ECDH", public: recipientPub },
				eph.privateKey,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt"]
			);
			const wrapIv = crypto.getRandomValues(new Uint8Array(12));
			const wrapped = await crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIv }, kek, cekRaw);

			wrappedKeys.push({
				recipientUserId: recipient.userId,
				recipientDeviceId: recipient.deviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u: this.b64url(new Uint8Array(wrapped)),
				wrapIvB64u: this.b64url(wrapIv),
			});
		}

		// Share the snippet
		const response = await fetch(`${base}/api/protected/code-share/share`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
			body: JSON.stringify({
				ciphertextB64u: this.b64url(new Uint8Array(ciphertext)),
				ivB64u: this.b64url(iv),
				wrappedKeys,
				metadata: { teamId: "default", title },
			}),
		});

		if (!response.ok) {
			throw new Error(`Share failed (${response.status})`);
		}
	}

	async getSnippets() {
		const { base, access } = await this.getBaseAndAccess();
		const response = await fetch(`${base}/api/protected/code-share/list-team`, {
			headers: { Authorization: `Bearer ${access}` },
		});

		const data = await response.json();
		return Array.isArray(data?.items) ? data.items : [];
	}

	async viewSnippet(snippetId) {
		const { base, access } = await this.getBaseAndAccess();
		const response = await fetch(`${base}/api/protected/code-share/${encodeURIComponent(snippetId)}`, {
			headers: { Authorization: `Bearer ${access}` },
		});

		const snippet = await response.json();
		return await this.tryDecryptSnippet(snippet);
	}

	async tryDecryptSnippet(snippet) {
		try {
			const encKeypair = await chrome.storage.local.get(["osmynt.encKeypair"]);
			if (!encKeypair["osmynt.encKeypair"]) return null;

			const parsed = JSON.parse(encKeypair["osmynt.encKeypair"]);
			if (!parsed?.privateKeyJwk) return null;

			const priv = await crypto.subtle.importKey(
				"jwk",
				parsed.privateKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				["deriveKey", "deriveBits"]
			);

			for (const wk of snippet.wrappedKeys ?? []) {
				if (!wk?.senderEphemeralPublicKeyJwk || !wk?.wrappedCekB64u || !wk?.wrapIvB64u) continue;

				try {
					const senderPub = await crypto.subtle.importKey(
						"jwk",
						wk.senderEphemeralPublicKeyJwk,
						{ name: "ECDH", namedCurve: "P-256" },
						true,
						[]
					);
					const kek = await crypto.subtle.deriveKey(
						{ name: "ECDH", public: senderPub },
						priv,
						{ name: "AES-GCM", length: 256 },
						false,
						["decrypt"]
					);
					const wrappedBytes = this.b64uToBytes(wk.wrappedCekB64u);
					const wrapIv = this.b64uToBytes(wk.wrapIvB64u);
					const cekRaw = await crypto.subtle.decrypt({ name: "AES-GCM", iv: wrapIv }, kek, wrappedBytes);
					const cek = await crypto.subtle.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, false, [
						"decrypt",
					]);
					const iv = this.b64uToBytes(snippet.ivB64u);
					const ciphertext = this.b64uToBytes(snippet.ciphertextB64u);
					const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cek, ciphertext);
					return new TextDecoder().decode(plaintext);
				} catch {
					// Try next entry
				}
			}
		} catch (error) {
			console.error("Decryption failed:", error);
		}

		return null;
	}

	async getBaseAndAccess() {
		const base = process.env.ENGINE_BASE_URL || "http://localhost:3000";
		const result = await chrome.storage.local.get(["osmynt.accessToken"]);
		const access = result["osmynt.accessToken"];
		if (!access) throw new Error("Not logged in");
		return { base, access };
	}

	async handleOAuthSuccess(account) {
		// Handle successful OAuth authentication
		// This would typically involve exchanging the authorization code for an access token
		console.log("OAuth success:", account);
	}

	b64url(data) {
		return btoa(String.fromCharCode(...data))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=/g, "");
	}

	b64uToBytes(s) {
		const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
		return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
	}
}

// Initialize background script
new OsmyntBackground();
