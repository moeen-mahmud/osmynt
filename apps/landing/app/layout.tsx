import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Suspense } from "react";
import { RebrandBanner } from "@/components/rebrand-banner";

export const metadata: Metadata = {
	title: "Osmynt - Secure Code Sharing for Developer Teams",
	description:
		"End-to-end encrypted, real-time code sharing directly in your editor. No context switching, no workflow disruption.",
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
				<RebrandBanner />
				<Suspense fallback={null}>{children}</Suspense>
				<Analytics />
			</body>
		</html>
	);
}
