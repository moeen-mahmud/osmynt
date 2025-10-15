"use client";

import { Button } from "@/components/ui/button";
import { Book, BookOpen, Code2, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { OsmyntLogo } from "@/components/osmynt-logo";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
			className={`fixed left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm transition-all duration-300 ${bannerVisible ? "top-12" : "top-0"}`}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-2">
						<OsmyntLogo />
						<span className="text-xl font-bold">Osmynt</span>
					</div>

					<nav className="hidden md:flex items-center gap-8">
						<a
							href="#features"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Features
						</a>
						<a
							href="#security"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Security
						</a>
						<a
							href="#comparison"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Comparison
						</a>
						<a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
							FAQ
						</a>
					</nav>

					<div className="flex items-center gap-4">
						<Button variant="outline" className="hidden md:inline-flex" asChild>
							<a href="https://docs.osmynt.dev">
								<BookOpen className="h-4 w-4" />
								Docs
							</a>
						</Button>

						<button
							type="button"
							className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							<Menu className="h-6 w-6" />
						</button>
					</div>
				</div>

				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden py-4 border-t border-border"
					>
						<nav className="flex flex-col gap-4">
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
								onClick={() => setMobileMenuOpen(false)}
							>
								<a href="#features">Features</a>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
								onClick={() => setMobileMenuOpen(false)}
							>
								<a href="#security">Security</a>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
								onClick={() => setMobileMenuOpen(false)}
							>
								<a href="#comparison">Comparison</a>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
								onClick={() => setMobileMenuOpen(false)}
							>
								<a href="#faq">FAQ</a>
							</button>
							<button type="button" onClick={() => setMobileMenuOpen(false)}>
								<a
									href="https://docs.osmynt.dev"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Docs
								</a>
							</button>
							{/* <Button className="w-full" asChild>
								<a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">
									Install Extension
								</a>
							</Button> */}
						</nav>
					</motion.div>
				)}
			</div>
		</motion.header>
	);
}
