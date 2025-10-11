// Browser extension popup script
class OsmyntPopup {
	constructor() {
		this.isLoggedIn = false;
		this.init();
	}

	async init() {
		await this.checkLoginStatus();
		this.attachEventListeners();
	}

	async checkLoginStatus() {
		try {
			const result = await chrome.storage.local.get(["osmynt.accessToken"]);
			this.isLoggedIn = !!result["osmynt.accessToken"];
			this.updateUI();
		} catch (error) {
			console.error("Failed to check login status:", error);
		}
	}

	updateUI() {
		const loginSection = document.getElementById("login-section");
		const mainSection = document.getElementById("main-section");

		if (this.isLoggedIn) {
			loginSection.classList.add("hidden");
			mainSection.classList.remove("hidden");
			this.loadSnippets();
		} else {
			loginSection.classList.remove("hidden");
			mainSection.classList.add("hidden");
		}
	}

	attachEventListeners() {
		// Login button
		document.getElementById("login-btn")?.addEventListener("click", () => this.handleLogin());

		// Logout button
		document.getElementById("logout-btn")?.addEventListener("click", () => this.handleLogout());

		// Share button
		document.getElementById("share-btn")?.addEventListener("click", () => this.handleShare());

		// Refresh button
		document.getElementById("refresh-btn")?.addEventListener("click", () => this.handleRefresh());
	}

	async handleLogin() {
		try {
			this.showStatus("Opening GitHub authentication...", "info");

			// Open GitHub OAuth in a new tab
			const clientId = "your-github-oauth-client-id"; // You'll need to set this up
			const redirectUri = chrome.identity.getRedirectURL();
			const scope = "user:email";
			const state = Math.random().toString(36).substring(7);

			// Store state for verification
			await chrome.storage.local.set({ "osmynt.auth.state": state });

			const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

			chrome.tabs.create({ url: authUrl });
			window.close();
		} catch (error) {
			console.error("Login failed:", error);
			this.showStatus("Login failed. Please try again.", "error");
		}
	}

	async handleLogout() {
		try {
			await chrome.storage.local.clear();
			this.isLoggedIn = false;
			this.updateUI();
			this.showStatus("Logged out successfully", "success");
		} catch (error) {
			console.error("Logout failed:", error);
			this.showStatus("Logout failed", "error");
		}
	}

	async handleShare() {
		const codeInput = document.getElementById("code-input");
		const code = codeInput?.value?.trim();

		if (!code) {
			this.showStatus("Please enter some code to share", "error");
			return;
		}

		try {
			this.showStatus("Sharing code...", "info");

			// Send message to background script to handle sharing
			const response = await chrome.runtime.sendMessage({
				action: "shareCode",
				code: code,
				title: "Browser Share",
			});

			if (response.success) {
				this.showStatus("Code shared successfully!", "success");
				codeInput.value = "";
				this.loadSnippets();
			} else {
				this.showStatus("Failed to share code", "error");
			}
		} catch (error) {
			console.error("Share failed:", error);
			this.showStatus("Failed to share code", "error");
		}
	}

	async handleRefresh() {
		await this.loadSnippets();
		this.showStatus("Refreshed", "success");
	}

	async loadSnippets() {
		try {
			const response = await chrome.runtime.sendMessage({ action: "getSnippets" });

			if (response.success) {
				this.updateSnippetsList(response.snippets);
			}
		} catch (error) {
			console.error("Failed to load snippets:", error);
		}
	}

	updateSnippetsList(snippets) {
		const snippetsList = document.getElementById("snippets-list");
		if (!snippetsList) return;

		snippetsList.innerHTML = snippets
			.map(
				snippet => `
      <div class="snippet-item" data-snippet-id="${snippet.id}">
        <div class="snippet-title">${snippet.title || "Untitled"}</div>
        <div class="snippet-meta">${snippet.authorName || "Unknown"} • ${new Date(snippet.createdAt).toLocaleDateString()}</div>
      </div>
    `
			)
			.join("");

		// Add click listeners to snippets
		snippetsList.querySelectorAll(".snippet-item").forEach(element => {
			element.addEventListener("click", e => {
				const snippetId = e.currentTarget.getAttribute("data-snippet-id");
				if (snippetId) {
					this.viewSnippet(snippetId);
				}
			});
		});
	}

	async viewSnippet(snippetId) {
		try {
			const response = await chrome.runtime.sendMessage({
				action: "viewSnippet",
				snippetId: snippetId,
			});

			if (response.success) {
				// Open snippet in a new tab
				chrome.tabs.create({ url: `data:text/html,<pre>${response.content}</pre>` });
			} else {
				this.showStatus("Failed to view snippet", "error");
			}
		} catch (error) {
			console.error("Failed to view snippet:", error);
			this.showStatus("Failed to view snippet", "error");
		}
	}

	showStatus(message, type) {
		const status = document.getElementById("status");
		if (status) {
			status.textContent = message;
			status.className = `status ${type}`;
			status.classList.remove("hidden");

			// Hide after 3 seconds
			setTimeout(() => {
				status.classList.add("hidden");
			}, 3000);
		}
	}
}

// Initialize popup when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	new OsmyntPopup();
});
