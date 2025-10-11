import type { BrowserStorage } from "./storage";
import type { BrowserCrypto } from "./crypto";
import type { BrowserUI } from "./ui";
import { ACCESS_SECRET_KEY, DEVICE_ID_KEY, ENC_KEYPAIR_JWK_KEY } from "@/constants/osmynt.constant";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import { ENV } from "./env";

export class OsmyntBrowserApp {
	private storage: BrowserStorage;
	private crypto: BrowserCrypto;
	private ui: BrowserUI;
	private isInitialized: boolean = false;

	constructor(storage: BrowserStorage, crypto: BrowserCrypto, ui: BrowserUI) {
		this.storage = storage;
		this.crypto = crypto;
		this.ui = ui;
	}

	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		this.setupEventListeners();
		await this.checkLoginStatus();
		this.isInitialized = true;
	}

	private setupEventListeners(): void {
		if (typeof window === "undefined") return;

		// Listen for custom events from the UI
		window.addEventListener("osmynt:login", () => this.handleLogin());
		window.addEventListener("osmynt:logout", () => this.handleLogout());
		window.addEventListener("osmynt:share", (e: any) => this.handleShare(e.detail.code));
		window.addEventListener("osmynt:refresh", () => this.handleRefresh());
		window.addEventListener("osmynt:viewSnippet", (e: any) => this.handleViewSnippet(e.detail.snippetId));
	}

	private async checkLoginStatus(): Promise<void> {
		const access = await this.storage.get(ACCESS_SECRET_KEY);
		this.ui.setLoggedIn(!!access);

		if (access) {
			await this.ensureDeviceKeys();
			await this.loadSnippets();
		}
	}

	private async handleLogin(): Promise<void> {
		try {
			// For browser, we'll use a simple GitHub OAuth flow
			const githubAuthUrl = this.buildGitHubAuthUrl();

			// Open popup window for OAuth
			const popup = window.open(
				githubAuthUrl,
				"osmynt-github-auth",
				"width=500,height=600,scrollbars=yes,resizable=yes"
			);

			if (!popup) {
				this.ui.showMessage("Please allow popups for GitHub authentication", "error");
				return;
			}

			// Listen for the popup to close or send a message
			const checkClosed = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosed);
					this.checkLoginStatus();
				}
			}, 1000);

			// Listen for messages from the popup
			const messageListener = (event: MessageEvent) => {
				if (event.origin !== window.location.origin) return;

				if (event.data.type === "osmynt:auth-success") {
					clearInterval(checkClosed);
					window.removeEventListener("message", messageListener);
					popup.close();

					// Store the access token
					this.storage.store(ACCESS_SECRET_KEY, event.data.accessToken);
					this.storage.store("osmynt.refresh", event.data.refreshToken);

					this.ui.setLoggedIn(true);
					this.ui.showMessage("Successfully logged in!", "success");
					this.ensureDeviceKeys();
					this.loadSnippets();
				}
			};

			window.addEventListener("message", messageListener);
		} catch (error) {
			console.error("Login failed:", error);
			this.ui.showMessage("Login failed. Please try again.", "error");
		}
	}

	private buildGitHubAuthUrl(): string {
		const clientId = "your-github-oauth-client-id"; // You'll need to set this up
		const redirectUri = `${window.location.origin}/auth/callback`;
		const scope = "user:email";
		const state = Math.random().toString(36).substring(7);

		// Store state for verification
		this.storage.store("osmynt.auth.state", state);

		return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
	}

	private async handleLogout(): Promise<void> {
		try {
			await this.storage.delete(ACCESS_SECRET_KEY);
			await this.storage.delete("osmynt.refresh");
			await this.storage.delete(DEVICE_ID_KEY);
			await this.storage.delete(ENC_KEYPAIR_JWK_KEY);

			this.ui.setLoggedIn(false);
			this.ui.showMessage("Logged out successfully", "success");
		} catch (error) {
			console.error("Logout failed:", error);
			this.ui.showMessage("Logout failed", "error");
		}
	}

	private async handleShare(code: string): Promise<void> {
		if (!code.trim()) {
			this.ui.showMessage("Please enter some code to share", "error");
			return;
		}

		try {
			const { base, access } = await this.getBaseAndAccess();

			// For now, we'll share with the default team
			// In a full implementation, you'd want to show a team/user picker
			const target = { kind: "team" as const };

			await this.shareCode(code, "Browser Share", target);
			this.ui.showMessage("Code shared successfully!", "success");

			// Clear the input
			const codeInput = document.getElementById("osmynt-code-input") as HTMLTextAreaElement;
			if (codeInput) {
				codeInput.value = "";
			}

			// Refresh snippets
			await this.loadSnippets();
		} catch (error) {
			console.error("Share failed:", error);
			this.ui.showMessage("Failed to share code", "error");
		}
	}

	private async handleRefresh(): Promise<void> {
		await this.loadSnippets();
		this.ui.showMessage("Refreshed", "success");
	}

	private async handleViewSnippet(snippetId: string): Promise<void> {
		try {
			const { base, access } = await this.getBaseAndAccess();
			const response = await fetch(
				`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(snippetId))}`,
				{
					headers: { Authorization: `Bearer ${access}` },
				}
			);

			const snippet = await response.json();
			const decryptedContent = await this.tryDecryptSnippet(snippet);

			if (decryptedContent) {
				// Show the snippet content in a modal or new window
				this.showSnippetModal(decryptedContent, snippet);
			} else {
				this.ui.showMessage("Unable to decrypt snippet", "error");
			}
		} catch (error) {
			console.error("Failed to view snippet:", error);
			this.ui.showMessage("Failed to load snippet", "error");
		}
	}

	private showSnippetModal(content: string, snippet: any): void {
		if (typeof document === "undefined") return;

		// Create a modal to display the snippet
		const modal = document.createElement("div");
		modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10002;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

		modal.innerHTML = `
      <div style="
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        max-height: 80%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      ">
        <div style="
          padding: 16px;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <h3 style="margin: 0; font-size: 16px;">${snippet.metadata?.title || "Snippet"}</h3>
          <button id="close-modal" style="
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            font-size: 18px;
          ">×</button>
        </div>
        <div style="
          padding: 16px;
          overflow-y: auto;
          flex: 1;
        ">
          <pre style="
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 12px;
            margin: 0;
            color: #ffffff;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            white-space: pre-wrap;
            word-wrap: break-word;
          ">${content}</pre>
        </div>
        <div style="
          padding: 16px;
          border-top: 1px solid #333;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        ">
          <button id="copy-snippet" style="
            background: #2196f3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Copy</button>
          <button id="close-modal-btn" style="
            background: #666;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Close</button>
        </div>
      </div>
    `;

		document.body.appendChild(modal);

		// Add event listeners
		const closeModal = () => {
			document.body.removeChild(modal);
		};

		modal.querySelector("#close-modal")?.addEventListener("click", closeModal);
		modal.querySelector("#close-modal-btn")?.addEventListener("click", closeModal);
		modal.querySelector("#copy-snippet")?.addEventListener("click", () => {
			if (navigator.clipboard) {
				navigator.clipboard.writeText(content).then(() => {
					this.ui.showMessage("Copied to clipboard!", "success");
				});
			}
		});

		// Close on backdrop click
		modal.addEventListener("click", (e: Event) => {
			if (e.target === modal) {
				closeModal();
			}
		});
	}

	private async ensureDeviceKeys(): Promise<void> {
		let deviceId = await this.storage.get(DEVICE_ID_KEY);
		if (!deviceId) {
			deviceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			await this.storage.store(DEVICE_ID_KEY, deviceId);
		}

		let encKeypairJwk = await this.storage.get(ENC_KEYPAIR_JWK_KEY);
		if (!encKeypairJwk) {
			const kp = await this.crypto.generateKey("ECDH", true, ["deriveKey", "deriveBits"]);
			const pub = await this.crypto.exportKey("jwk", kp.publicKey);
			const priv = await this.crypto.exportKey("jwk", kp.privateKey);
			encKeypairJwk = JSON.stringify({ publicKeyJwk: pub, privateKeyJwk: priv });
			await this.storage.store(ENC_KEYPAIR_JWK_KEY, encKeypairJwk);
			await this.registerDeviceKey(deviceId, pub);
		} else {
			try {
				const parsed = JSON.parse(encKeypairJwk);
				if (parsed?.publicKeyJwk) {
					await this.registerDeviceKey(deviceId, parsed.publicKeyJwk);
				}
			} catch (error) {
				console.error("Failed to parse device keys:", error);
			}
		}
	}

	private async registerDeviceKey(deviceId: string, publicKeyJwk: any): Promise<void> {
		const { base, access } = await this.getBaseAndAccess();
		await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.register}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
			body: JSON.stringify({ deviceId, encryptionPublicKeyJwk: publicKeyJwk, algorithm: "ECDH-P-256" }),
		});
	}

	private async loadSnippets(): Promise<void> {
		try {
			const { base, access } = await this.getBaseAndAccess();
			const response = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.listTeam}`, {
				headers: { Authorization: `Bearer ${access}` },
			});

			const data = await response.json();
			const snippets = Array.isArray(data?.items) ? data.items : [];
			this.ui.updateSnippets(snippets);
		} catch (error) {
			console.error("Failed to load snippets:", error);
		}
	}

	private async getBaseAndAccess(): Promise<{ base: string; access: string }> {
		const base = ENDPOINTS.engineBaseUrl!.replace(/\/$/, "");
		const access = await this.storage.get(ACCESS_SECRET_KEY);
		if (!access) throw new Error("Not logged in");
		return { base, access };
	}

	private async shareCode(code: string, title: string, target: any): Promise<void> {
		const { base, access } = await this.getBaseAndAccess();

		// Get recipients for the team
		const recipientsRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.teamById("default")}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const recipientsData = await recipientsRes.json();
		const recipients = Array.isArray(recipientsData?.recipients) ? recipientsData.recipients : [];

		if (recipients.length === 0) {
			throw new Error("No recipients found");
		}

		// Encrypt content
		const iv = this.crypto.randomBytes(12);
		const cekRaw = this.crypto.randomBytes(32);
		const cek = await this.crypto.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, true, [
			"encrypt",
			"wrapKey",
		]);
		const ciphertext = await this.crypto.encrypt({ name: "AES-GCM", iv }, cek, new TextEncoder().encode(code));

		// Create wrapped keys for recipients
		const wrappedKeys: any[] = [];
		const eph = await this.crypto.generateKey("ECDH", true, ["deriveKey", "deriveBits"]);
		const ephPubJwk = await this.crypto.exportKey("jwk", eph.publicKey);

		for (const recipient of recipients) {
			const recipientPub = await this.crypto.importKey(
				"jwk",
				recipient.encryptionPublicKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				[]
			);
			const kek = await this.crypto.deriveKey(
				{ name: "ECDH", public: recipientPub },
				eph.privateKey,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt"]
			);
			const wrapIv = this.crypto.randomBytes(12);
			const wrapped = await this.crypto.encrypt({ name: "AES-GCM", iv: wrapIv }, kek, cekRaw);

			wrappedKeys.push({
				recipientUserId: recipient.userId,
				recipientDeviceId: recipient.deviceId,
				senderEphemeralPublicKeyJwk: ephPubJwk,
				wrappedCekB64u: this.crypto.b64url(new Uint8Array(wrapped)),
				wrapIvB64u: this.crypto.b64url(wrapIv),
			});
		}

		// Share the snippet
		const response = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.share}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
			body: JSON.stringify({
				ciphertextB64u: this.crypto.b64url(new Uint8Array(ciphertext)),
				ivB64u: this.crypto.b64url(iv),
				wrappedKeys,
				metadata: { teamId: "default", title },
			}),
		});

		if (!response.ok) {
			throw new Error(`Share failed (${response.status})`);
		}
	}

	private async tryDecryptSnippet(snippet: any): Promise<string | null> {
		try {
			const encKeypair = JSON.parse((await this.storage.get(ENC_KEYPAIR_JWK_KEY)) || "{}");
			if (!encKeypair?.privateKeyJwk) return null;

			const priv = await this.crypto.importKey(
				"jwk",
				encKeypair.privateKeyJwk,
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				["deriveKey", "deriveBits"]
			);

			for (const wk of snippet.wrappedKeys ?? []) {
				if (!wk?.senderEphemeralPublicKeyJwk || !wk?.wrappedCekB64u || !wk?.wrapIvB64u) continue;

				try {
					const senderPub = await this.crypto.importKey(
						"jwk",
						wk.senderEphemeralPublicKeyJwk,
						{ name: "ECDH", namedCurve: "P-256" },
						true,
						[]
					);
					const kek = await this.crypto.deriveKey(
						{ name: "ECDH", public: senderPub },
						priv,
						{ name: "AES-GCM", length: 256 },
						false,
						["decrypt"]
					);
					const wrappedBytes = this.crypto.b64uToBytes(wk.wrappedCekB64u);
					const wrapIv = this.crypto.b64uToBytes(wk.wrapIvB64u);
					const cekRaw = await this.crypto.decrypt({ name: "AES-GCM", iv: wrapIv }, kek, wrappedBytes);
					const cek = await this.crypto.importKey("raw", cekRaw, { name: "AES-GCM", length: 256 }, false, [
						"decrypt",
					]);
					const iv = this.crypto.b64uToBytes(snippet.ivB64u);
					const ciphertext = this.crypto.b64uToBytes(snippet.ciphertextB64u);
					const plaintext = await this.crypto.decrypt({ name: "AES-GCM", iv }, cek, ciphertext);
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

	async destroy(): Promise<void> {
		// Clean up event listeners and resources
		this.isInitialized = false;
	}
}
