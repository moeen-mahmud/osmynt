import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Suspense } from "react";
import { StructuredData } from "@/components/structured-data";
import { PerformanceOptimizer } from "@/components/performance";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleTagManager, GTMNoScript } from "@/components/gtm";

export const metadata: Metadata = {
	title: {
		default: "Osmynt - Secure Code Sharing for Developer Teams",
		template: "%s | Osmynt",
	},
	description:
		"End-to-end encrypted, real-time code sharing directly in your editor. No context switching, no workflow disruption. Built for developer teams who value security and productivity.",
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
	authors: [{ name: "Moeen Mahmud", url: "https://github.com/moeen-mahmud" }],
	creator: "Moeen Mahmud",
	publisher: "Osmynt",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://osmynt.dev"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://osmynt.dev",
		title: "Osmynt - Secure Code Sharing for Developer Teams",
		description:
			"End-to-end encrypted, real-time code sharing directly in your editor. No context switching, no workflow disruption.",
		siteName: "Osmynt",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Osmynt - Secure Code Sharing for Developer Teams",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Osmynt - Secure Code Sharing for Developer Teams",
		description:
			"End-to-end encrypted, real-time code sharing directly in your editor. No context switching, no workflow disruption.",
		images: ["/og-image.png"],
		creator: "@moeen_mahmud",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-N744GSGN";

	return (
		<html lang="en">
			<head>
				<GoogleTagManager gtmId={gtmId} />
				<StructuredData />
			</head>
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
				<GTMNoScript gtmId={gtmId} />
				<ThemeProvider>
					<PerformanceOptimizer />
					{/* <RebrandBanner /> */}
					<Suspense fallback={null}>{children}</Suspense>
					<SpeedInsights />
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
