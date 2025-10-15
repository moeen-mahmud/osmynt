"use client";

export function StructuredData() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Osmynt",
		description:
			"End-to-end encrypted, real-time code sharing directly in your editor. No context switching, no workflow disruption.",
		url: "https://osmynt.dev",
		applicationCategory: "DeveloperApplication",
		operatingSystem: "VS Code",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
		author: {
			"@type": "Person",
			name: "Moeen Mahmud",
			url: "https://github.com/moeen-mahmud",
		},
		publisher: {
			"@type": "Organization",
			name: "Osmynt",
			url: "https://osmynt.dev",
		},
		keywords: [
			"code sharing",
			"secure code sharing",
			"developer tools",
			"VS Code extension",
			"end-to-end encryption",
			"real-time collaboration",
			"team development",
			"code collaboration",
			"secure development",
			"developer productivity",
		],
		featureList: [
			"End-to-end encryption",
			"Real-time collaboration",
			"Native editor integration",
			"Team management",
			"Git-like diff application",
			"Multi-device support",
			"Zero-knowledge architecture",
			"Secure key exchange",
		],
		screenshot: "https://osmynt.dev/og-image.png",
		softwareVersion: "1.3.5",
		datePublished: "2024-01-01",
		dateModified: new Date().toISOString().split("T")[0],
		license: "https://opensource.org/licenses/BSL-1.1",
		downloadUrl: "https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt",
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.8",
			ratingCount: "150",
			bestRating: "5",
			worstRating: "1",
		},
	};

	// biome-ignore lint/security/noDangerouslySetInnerHtml: false positive
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
