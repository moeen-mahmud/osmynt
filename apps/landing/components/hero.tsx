"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { gtmEvent, gtmEngagement } from "@/components/gtm";
import { GuidedDemo } from "@/components/demo/guided-demo";

export function Hero() {
	const [bannerVisible, setBannerVisible] = useState(false);

	useEffect(() => {
		// Check if banner is visible by looking at body padding
		const checkBanner = () => {
			const bodyPaddingTop = document.body.style.paddingTop;
			setBannerVisible(bodyPaddingTop === "48px");
		};

		// Check initially
		checkBanner();

		// Watch for changes
		const observer = new MutationObserver(checkBanner);
		observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

		return () => observer.disconnect();
	}, []);

	const handleInstallClick = () => {
		// Track the main CTA click
		gtmEvent("cta_click", {
			cta_type: "install_extension",
			cta_location: "hero_section",
			cta_text: "Install for VS Code",
		});

		// Track user engagement
		gtmEngagement("click", "cta", "install_button", 1);
	};

	return (
		<>
			<section className={`${bannerVisible ? "pt-40" : "pt-32"} pb-20 px-4 sm:px-6 lg:px-8`} role="banner">
				<div className="container mx-auto max-w-5xl">
					<header className="text-center space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground border border-border"
						>
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							Now in Beta
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
						>
							Share code securely,
							<br />
							<span className="text-primary">without breaking your flow</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
						>
							The only code sharing tool that combines end-to-end encryption, real-time collaboration, and
							native editor integration. No more context switching, no more security compromises.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="flex flex-col sm:flex-row items-center justify-center gap-4"
						>
							<Button size="lg" className="gap-2 group" asChild>
								<a
									href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt"
									onClick={handleInstallClick}
								>
									Install for VS Code
									<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</a>
							</Button>
							{/* <Button size="lg" variant="outline" className="gap-2 bg-transparent group" asChild>
							<a href="https://github.com/moeen-mahmud/osmynt">
								<Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
								View on GitHub
							</a>
						</Button> */}
						</motion.div>
					</header>
				</div>
			</section>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="pb-16"
			>
				<GuidedDemo />
			</motion.div>
		</>
	);
}
