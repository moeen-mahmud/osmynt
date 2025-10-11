// Browser extension content script
class OsmyntContentScript {
	constructor() {
		this.init();
	}

	init() {
		// Inject the Osmynt UI into web pages
		this.injectUI();
		this.attachEventListeners();
	}

	injectUI() {
		// Create a floating button for Osmynt
		const button = document.createElement("div");
		button.id = "osmynt-floating-button";
		button.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #007acc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <img src="${chrome.runtime.getURL("resources/osmynt.svg")}" alt="Osmynt" style="width: 24px; height: 24px; filter: brightness(0) invert(1);">
      </div>
    `;

		document.body.appendChild(button);
	}

	attachEventListeners() {
		// Listen for clicks on the floating button
		document.addEventListener("click", e => {
			if (e.target.closest("#osmynt-floating-button")) {
				this.toggleOsmyntPanel();
			}
		});

		// Listen for keyboard shortcuts
		document.addEventListener("keydown", e => {
			// Ctrl/Cmd + Shift + O to toggle Osmynt
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "O") {
				e.preventDefault();
				this.toggleOsmyntPanel();
			}
		});

		// Listen for selection changes to enable quick sharing
		document.addEventListener("mouseup", () => {
			const selection = window.getSelection();
			if (selection && selection.toString().trim()) {
				this.showQuickShareOption(selection.toString());
			}
		});
	}

	toggleOsmyntPanel() {
		// Open the extension popup
		chrome.runtime.sendMessage({ action: "openPopup" });
	}

	showQuickShareOption(selectedText) {
		// Create a quick share tooltip
		const tooltip = document.createElement("div");
		tooltip.id = "osmynt-quick-share";
		tooltip.innerHTML = `
      <div style="
        position: absolute;
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 6px;
        padding: 8px 12px;
        color: white;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        cursor: pointer;
      ">
        Share with Osmynt
      </div>
    `;

		// Position the tooltip near the selection
		const range = window.getSelection().getRangeAt(0);
		const rect = range.getBoundingClientRect();

		tooltip.style.left = `${rect.left + window.scrollX}px`;
		tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

		document.body.appendChild(tooltip);

		// Add click handler
		tooltip.addEventListener("click", () => {
			this.shareSelectedText(selectedText);
			document.body.removeChild(tooltip);
		});

		// Remove tooltip after 3 seconds
		setTimeout(() => {
			if (document.body.contains(tooltip)) {
				document.body.removeChild(tooltip);
			}
		}, 3000);
	}

	async shareSelectedText(text) {
		try {
			// Send the selected text to the background script for sharing
			const response = await chrome.runtime.sendMessage({
				action: "shareCode",
				code: text,
				title: "Quick Share",
			});

			if (response.success) {
				this.showNotification("Code shared successfully!", "success");
			} else {
				this.showNotification("Failed to share code", "error");
			}
		} catch (error) {
			console.error("Failed to share selected text:", error);
			this.showNotification("Failed to share code", "error");
		}
	}

	showNotification(message, type) {
		const notification = document.createElement("div");
		notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "error" ? "#f44336" : "#4caf50"};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 10002;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
		notification.textContent = message;

		document.body.appendChild(notification);

		// Remove after 3 seconds
		setTimeout(() => {
			if (document.body.contains(notification)) {
				document.body.removeChild(notification);
			}
		}, 3000);
	}
}

// Initialize content script when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => new OsmyntContentScript());
} else {
	new OsmyntContentScript();
}
