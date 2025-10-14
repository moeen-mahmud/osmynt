// Osmynt Documentation JavaScript

document.addEventListener("DOMContentLoaded", () => {
	// Initialize documentation features
	initSearch();
	initNavigation();
	initCodeBlocks();
	initScrollToTop();
	initThemeToggle();
});

// Search functionality
function initSearch() {
	const searchInput = document.querySelector("#search-input");
	if (!searchInput) return;

	searchInput.addEventListener("input", e => {
		const query = e.target.value.toLowerCase();
		const results = document.querySelectorAll(".search-result");

		results.forEach(result => {
			const text = result.textContent.toLowerCase();
			if (text.includes(query)) {
				result.style.display = "block";
			} else {
				result.style.display = "none";
			}
		});
	});
}

// Navigation functionality
function initNavigation() {
	const navLinks = document.querySelectorAll(".nav-link");
	const currentPath = window.location.pathname;

	navLinks.forEach(link => {
		if (link.getAttribute("href") === currentPath) {
			link.classList.add("active");
		}
	});
}

// Code block functionality
function initCodeBlocks() {
	const codeBlocks = document.querySelectorAll("pre code");

	codeBlocks.forEach(block => {
		// Add copy button
		const copyButton = document.createElement("button");
		copyButton.className = "copy-button";
		copyButton.textContent = "Copy";
		copyButton.addEventListener("click", () => {
			navigator.clipboard.writeText(block.textContent).then(() => {
				copyButton.textContent = "Copied!";
				setTimeout(() => {
					copyButton.textContent = "Copy";
				}, 2000);
			});
		});

		// Add copy button to code block
		const pre = block.parentElement;
		pre.style.position = "relative";
		pre.appendChild(copyButton);
	});
}

// Scroll to top functionality
function initScrollToTop() {
	const scrollToTopButton = document.createElement("button");
	scrollToTopButton.className = "scroll-to-top";
	scrollToTopButton.innerHTML = "↑";
	scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--color-accent);
        color: var(--color-primary);
        border: none;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all var(--transition-fast);
    `;

	document.body.appendChild(scrollToTopButton);

	window.addEventListener("scroll", () => {
		if (window.pageYOffset > 300) {
			scrollToTopButton.style.display = "block";
		} else {
			scrollToTopButton.style.display = "none";
		}
	});

	scrollToTopButton.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
}

// Theme toggle functionality
function initThemeToggle() {
	const themeToggle = document.createElement("button");
	themeToggle.className = "theme-toggle";
	themeToggle.innerHTML = "🌙";
	themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--color-surface);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        cursor: pointer;
        z-index: 1000;
        transition: all var(--transition-fast);
    `;

	document.body.appendChild(themeToggle);

	// Check for saved theme preference
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme) {
		document.documentElement.setAttribute("data-theme", savedTheme);
		updateThemeIcon(savedTheme);
	}

	themeToggle.addEventListener("click", () => {
		const currentTheme = document.documentElement.getAttribute("data-theme");
		const newTheme = currentTheme === "dark" ? "light" : "dark";

		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);
		updateThemeIcon(newTheme);
	});

	function updateThemeIcon(theme) {
		themeToggle.innerHTML = theme === "dark" ? "☀️" : "🌙";
	}
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			target.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	});
});

// Keyboard shortcuts
document.addEventListener("keydown", e => {
	// Ctrl/Cmd + K for search
	if ((e.ctrlKey || e.metaKey) && e.key === "k") {
		e.preventDefault();
		const searchInput = document.querySelector("#search-input");
		if (searchInput) {
			searchInput.focus();
		}
	}

	// Escape to close modals
	if (e.key === "Escape") {
		const modals = document.querySelectorAll(".modal");
		modals.forEach(modal => {
			modal.style.display = "none";
		});
	}
});

// Copy to clipboard functionality
function copyToClipboard(text) {
	navigator.clipboard.writeText(text).then(() => {
		// Show success message
		const message = document.createElement("div");
		message.textContent = "Copied to clipboard!";
		message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--color-success);
            color: var(--color-primary);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-md);
            z-index: 1000;
            transition: all var(--transition-fast);
        `;

		document.body.appendChild(message);

		setTimeout(() => {
			message.remove();
		}, 2000);
	});
}

// Table of contents generation
function generateTableOfContents() {
	const headings = document.querySelectorAll("h2, h3, h4");
	const toc = document.querySelector(".table-of-contents");

	if (!toc || headings.length === 0) return;

	const tocList = document.createElement("ul");
	tocList.className = "toc-list";

	headings.forEach(heading => {
		const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, "-");
		heading.id = id;

		const tocItem = document.createElement("li");
		tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

		const tocLink = document.createElement("a");
		tocLink.href = `#${id}`;
		tocLink.textContent = heading.textContent;
		tocLink.className = "toc-link";

		tocItem.appendChild(tocLink);
		tocList.appendChild(tocItem);
	});

	toc.appendChild(tocList);
}

// Initialize table of contents
document.addEventListener("DOMContentLoaded", generateTableOfContents);

// Responsive navigation
function initResponsiveNavigation() {
	const navToggle = document.createElement("button");
	navToggle.className = "nav-toggle";
	navToggle.innerHTML = "☰";
	navToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-text);
    `;

	const nav = document.querySelector(".nav");
	if (nav) {
		nav.parentElement.insertBefore(navToggle, nav);

		navToggle.addEventListener("click", () => {
			nav.classList.toggle("nav-open");
		});
	}

	// Close nav when clicking outside
	document.addEventListener("click", e => {
		if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
			nav.classList.remove("nav-open");
		}
	});
}

// Initialize responsive navigation
document.addEventListener("DOMContentLoaded", initResponsiveNavigation);

// Performance optimization
function initPerformanceOptimizations() {
	// Lazy load images
	const images = document.querySelectorAll("img[data-src]");
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.removeAttribute("data-src");
				observer.unobserve(img);
			}
		});
	});

	// biome-ignore lint/suspicious/useIterableCallbackReturn: false positive
	images.forEach(img => imageObserver.observe(img));

	// Preload critical resources
	const criticalResources = ["/assets/css/main.css", "/assets/js/main.js"];

	criticalResources.forEach(resource => {
		const link = document.createElement("link");
		link.rel = "preload";
		link.href = resource;
		link.as = resource.endsWith(".css") ? "style" : "script";
		document.head.appendChild(link);
	});
}

// Initialize performance optimizations
document.addEventListener("DOMContentLoaded", initPerformanceOptimizations);
