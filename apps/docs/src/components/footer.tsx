import Link from "next/link";

export function Footer() {
	return (
		<footer className="w-full border-t border-border bg-card">
			<div className="container px-4 py-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Osmynt</h3>
						<p className="text-sm text-muted-foreground">
							Secure, real-time code sharing for VS Code. End-to-end encrypted collaboration directly in
							your editor.
						</p>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Documentation</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/getting-started"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Getting Started
								</Link>
							</li>
							<li>
								<Link
									href="/features"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="/reference"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Reference
								</Link>
							</li>
							<li>
								<Link
									href="/troubleshooting"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Troubleshooting
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Resources</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/security"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Security
								</Link>
							</li>
							<li>
								<Link
									href="/resources/support"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Support
								</Link>
							</li>
							<li>
								<Link
									href="/resources/roadmap"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Roadmap
								</Link>
							</li>
							<li>
								<Link
									href="/resources/brand-guidelines"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Brand Guidelines
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Community</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="https://github.com/moeen-mahmud/osmynt"
									target="_blank"
									rel="noopener"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href="https://discord.gg/osmynt"
									target="_blank"
									rel="noopener"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Discord
								</a>
							</li>
							<li>
								<a
									href="mailto:support@osmynt.dev"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Email
								</a>
							</li>
							<li>
								<a
									href="https://twitter.com/osmynt"
									target="_blank"
									rel="noopener"
									className="transition-colors text-muted-foreground hover:text-foreground"
								>
									Twitter
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 mt-8 text-sm text-center border-t border-border text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} Osmynt. All rights reserved.</p>
					<p className="mt-2">Made with ❤️ for the developers, by the developers</p>
				</div>
			</div>
		</footer>
	);
}
