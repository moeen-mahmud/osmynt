// Browser UI implementation
export class BrowserUI {
	private container: HTMLElement | null = null;
	private isLoggedIn: boolean = false;

	constructor() {
		this.createContainer();
	}

	private createContainer(): void {
		// Create a container for the Osmynt UI
		if (typeof document !== "undefined") {
			this.container = document.createElement("div");
			this.container.id = "osmynt-browser-extension";
			this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        max-height: 600px;
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #ffffff;
        overflow: hidden;
      `;

			// Add to body if not already present
			if (!document.getElementById("osmynt-browser-extension")) {
				document.body.appendChild(this.container);
			}
		}
	}

	render(): void {
		if (!this.container || typeof document === "undefined") return;

		this.container.innerHTML = `
      <div style="padding: 16px;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <img src="/resources/osmynt.svg" alt="Osmynt" style="width: 24px; height: 24px; margin-right: 8px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Osmynt</h2>
          <button id="osmynt-close" style="margin-left: auto; background: none; border: none; color: #ffffff; cursor: pointer; font-size: 18px;">×</button>
        </div>
        
        <div id="osmynt-content">
          ${this.isLoggedIn ? this.renderLoggedInView() : this.renderLoginView()}
        </div>
      </div>
    `;

		this.attachEventListeners();
	}

	private renderLoginView(): string {
		return `
      <div style="text-align: center;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px;">Welcome to Osmynt!</h3>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #cccccc;">
          Secure, E2EE, Realtime DM for code snippets ⚡
        </p>
        <button id="osmynt-login" style="
          background: #007acc;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          width: 100%;
        ">Login with GitHub</button>
      </div>
    `;
	}

	private renderLoggedInView(): string {
		return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 14px; color: #4caf50;">✓ Logged in</span>
          <button id="osmynt-logout" style="
            background: #f44336;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Logout</button>
        </div>
        
        <div style="margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">Share Code</h4>
          <textarea id="osmynt-code-input" placeholder="Paste your code here..." style="
            width: 100%;
            height: 120px;
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 8px;
            color: #ffffff;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            resize: vertical;
            box-sizing: border-box;
            margin-bottom: 12px;
          "></textarea>
        </div>
        
        <div style="display: flex; gap: 8px;">
          <button id="osmynt-share" style="
            background: #4caf50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
          ">Share Code</button>
          <button id="osmynt-refresh" style="
            background: #2196f3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
          ">Refresh</button>
        </div>
        
        <div id="osmynt-snippets" style="margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px;">Recent Snippets</h4>
          <div id="osmynt-snippets-list" style="max-height: 200px; overflow-y: auto;">
            <!-- Snippets will be loaded here -->
          </div>
        </div>
      </div>
    `;
	}

	private attachEventListeners(): void {
		if (typeof document === "undefined") return;

		// Close button
		const closeBtn = document.getElementById("osmynt-close");
		if (closeBtn) {
			closeBtn.addEventListener("click", () => this.hide());
		}

		// Login button
		const loginBtn = document.getElementById("osmynt-login");
		if (loginBtn) {
			loginBtn.addEventListener("click", () => this.onLogin());
		}

		// Logout button
		const logoutBtn = document.getElementById("osmynt-logout");
		if (logoutBtn) {
			logoutBtn.addEventListener("click", () => this.onLogout());
		}

		// Share button
		const shareBtn = document.getElementById("osmynt-share");
		if (shareBtn) {
			shareBtn.addEventListener("click", () => this.onShare());
		}

		// Refresh button
		const refreshBtn = document.getElementById("osmynt-refresh");
		if (refreshBtn) {
			refreshBtn.addEventListener("click", () => this.onRefresh());
		}
	}

	setLoggedIn(loggedIn: boolean): void {
		this.isLoggedIn = loggedIn;
		this.render();
	}

	show(): void {
		if (this.container) {
			this.container.style.display = "block";
		}
	}

	hide(): void {
		if (this.container) {
			this.container.style.display = "none";
		}
	}

	toggle(): void {
		if (this.container) {
			this.container.style.display = this.container.style.display === "none" ? "block" : "none";
		}
	}

	// Event handlers
	private onLogin(): void {
		// Emit custom event for login
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("osmynt:login"));
		}
	}

	private onLogout(): void {
		// Emit custom event for logout
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("osmynt:logout"));
		}
	}

	private onShare(): void {
		if (typeof document === "undefined") return;

		const codeInput = document.getElementById("osmynt-code-input") as HTMLTextAreaElement;
		if (codeInput?.value.trim()) {
			if (typeof window !== "undefined") {
				window.dispatchEvent(
					new CustomEvent("osmynt:share", {
						detail: { code: codeInput.value.trim() },
					})
				);
			}
		}
	}

	private onRefresh(): void {
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("osmynt:refresh"));
		}
	}

	// Method to update snippets list
	updateSnippets(snippets: any[]): void {
		if (typeof document === "undefined") return;

		const snippetsList = document.getElementById("osmynt-snippets-list");
		if (!snippetsList) return;

		snippetsList.innerHTML = snippets
			.map(
				snippet => `
      <div style="
        background: #2d2d2d;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
        cursor: pointer;
      " data-snippet-id="${snippet.id}">
        <div style="font-size: 12px; font-weight: 500; margin-bottom: 4px;">
          ${snippet.title || "Untitled"}
        </div>
        <div style="font-size: 11px; color: #cccccc;">
          ${snippet.authorName || "Unknown"} • ${new Date(snippet.createdAt).toLocaleDateString()}
        </div>
      </div>
    `
			)
			.join("");

		// Add click listeners to snippets
		snippetsList.querySelectorAll("[data-snippet-id]").forEach(element => {
			element.addEventListener("click", (e: Event) => {
				const snippetId = (e.currentTarget as HTMLElement).getAttribute("data-snippet-id");
				if (snippetId && typeof window !== "undefined") {
					window.dispatchEvent(
						new CustomEvent("osmynt:viewSnippet", {
							detail: { snippetId },
						})
					);
				}
			});
		});
	}

	showMessage(message: string, type: "info" | "success" | "error" = "info"): void {
		if (typeof document === "undefined") return;

		// Create a toast notification
		const toast = document.createElement("div");
		toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === "error" ? "#f44336" : type === "success" ? "#4caf50" : "#2196f3"};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 10001;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
		toast.textContent = message;

		document.body.appendChild(toast);

		// Remove after 3 seconds
		setTimeout(() => {
			if (toast.parentNode) {
				toast.parentNode.removeChild(toast);
			}
		}, 3000);
	}

	destroy(): void {
		if (this.container && this.container.parentNode) {
			this.container.parentNode.removeChild(this.container);
		}
	}
}
