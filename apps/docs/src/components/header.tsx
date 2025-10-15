"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, MessageCircle, Menu } from "lucide-react";
import { OsmyntLogo } from "@/components/ui/osmynt-logo";
import { useState } from "react";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href="/" className="flex items-center gap-2">
							<OsmyntLogo />
							<span className="text-xl font-bold">Osmynt</span>
						</Link>
						<span className="text-muted-foreground text-sm">Documentation</span>
					</div>

					<nav className="hidden md:flex items-center gap-8">
						<Link
							href="/getting-started"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Getting Started
						</Link>
						<Link
							href="/features"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Features
						</Link>
						<Link
							href="/reference"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Reference
						</Link>
						<Link
							href="/troubleshooting"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Troubleshooting
						</Link>
						<Link
							href="/security"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Security
						</Link>
						<Link
							href="/resources"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Resources
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
							<a href="https://github.com/moeen-mahmud/osmynt" target="_blank" rel="noopener">
								<Github className="h-4 w-4 mr-2" />
								GitHub
							</a>
						</Button>
						<Button size="sm" className="hidden md:inline-flex" asChild>
							<a href="https://discord.gg/osmynt" target="_blank" rel="noopener">
								<MessageCircle className="h-4 w-4 mr-2" />
								Discord
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
					<div className="md:hidden py-4 border-t border-border">
						<nav className="flex flex-col gap-4">
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Link href="/getting-started">Getting Started</Link>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Link href="/features">Features</Link>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Link href="/reference">Reference</Link>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Link href="/troubleshooting">Troubleshooting</Link>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Link href="/security">Security</Link>
							</button>
							<button
								type="button"
								className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Link href="/resources">Resources</Link>
							</button>
							<div className="flex flex-col gap-2 pt-4 border-t border-border">
								<Button variant="outline" size="sm" asChild>
									<a href="https://github.com/moeen-mahmud/osmynt" target="_blank" rel="noopener">
										<Github className="h-4 w-4 mr-2" />
										GitHub
									</a>
								</Button>
								<Button size="sm" asChild>
									<a href="https://discord.gg/osmynt" target="_blank" rel="noopener">
										<MessageCircle className="h-4 w-4 mr-2" />
										Discord
									</a>
								</Button>
							</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
