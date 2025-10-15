import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
	title: {
		default: "Osmynt Documentation",
		template: "%s | Osmynt Documentation",
	},
	description: "Secure, Git-powered, Realtime DM for code blocks ⚡",
	keywords: [
		"osmynt",
		"documentation",
		"code sharing",
		"vs code",
		"extension",
		"collaboration",
		"encryption",
		"real-time",
		"developer tools",
	],
	authors: [{ name: "Moeen Mahmud" }],
	creator: "Moeen Mahmud",
	publisher: "Osmynt",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://docs.osmynt.dev"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://docs.osmynt.dev",
		title: "Osmynt Documentation",
		description: "Secure, Git-powered, Realtime DM for code blocks ⚡",
		siteName: "Osmynt Documentation",
	},
	twitter: {
		card: "summary_large_image",
		title: "Osmynt Documentation",
		description: "Secure, Git-powered, Realtime DM for code blocks ⚡",
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
	verification: {
		google: "your-google-verification-code",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<head>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
				<ThemeProvider>
					<div className="min-h-screen bg-background">
						<Header />
						<div className="flex">
							<Navigation />
							<div className="flex-1 lg:ml-64">
								<main>
									<div className="container mx-auto px-4 py-8">{children}</div>
								</main>
								<Footer />
							</div>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
