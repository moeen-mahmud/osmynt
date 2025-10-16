"use client";

import { useEffect } from "react";

export function PerformanceOptimizer() {
	useEffect(() => {
		// Preload critical resources
		const preloadLink = document.createElement("link");
		preloadLink.rel = "preload";
		preloadLink.href = "/fonts/geist-sans.woff2";
		preloadLink.as = "font";
		preloadLink.type = "font/woff2";
		preloadLink.crossOrigin = "anonymous";
		document.head.appendChild(preloadLink);

		// Preload hero image
		const heroImage = document.createElement("link");
		heroImage.rel = "preload";
		heroImage.href = "/og-image.png";
		heroImage.as = "image";
		document.head.appendChild(heroImage);

		// Optimize images loading
		const images = document.querySelectorAll("img");
		images.forEach(img => {
			img.loading = "lazy";
			img.decoding = "async";
		});

		// Add resource hints
		const dnsPrefetch = document.createElement("link");
		dnsPrefetch.rel = "dns-prefetch";
		dnsPrefetch.href = "//fonts.googleapis.com";
		document.head.appendChild(dnsPrefetch);

		const preconnect = document.createElement("link");
		preconnect.rel = "preconnect";
		preconnect.href = "https://fonts.gstatic.com";
		preconnect.crossOrigin = "anonymous";
		document.head.appendChild(preconnect);

		// Cleanup
		return () => {
			document.head.removeChild(preloadLink);
			document.head.removeChild(heroImage);
			document.head.removeChild(dnsPrefetch);
			document.head.removeChild(preconnect);
		};
	}, []);

	return null;
}
