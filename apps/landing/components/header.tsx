"use client";

import { Button } from "@/components/ui/button";
import { Code2, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-2">
						<Code2 className="h-6 w-6 text-primary" />
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
						<a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
							FAQ
						</a>
						<a
							href="https://docs.osmynt.dev"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Docs
						</a>
					</nav>

					<div className="flex items-center gap-4">
						<Button className="hidden md:inline-flex" asChild>
							<a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">
								Install Extension
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
								<a href="#faq">FAQ</a>
							</button>
							<a
								href="https://docs.osmynt.dev"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Docs
							</a>
							<Button className="w-full" asChild>
								<a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">
									Install Extension
								</a>
							</Button>
						</nav>
					</motion.div>
				)}
			</div>
		</motion.header>
	);
}
