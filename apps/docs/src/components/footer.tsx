import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-border bg-card">
			<div className="container py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Getting Started
								</Link>
							</li>
							<li>
								<Link
									href="/features"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="/reference"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Reference
								</Link>
							</li>
							<li>
								<Link
									href="/troubleshooting"
									className="text-muted-foreground hover:text-foreground transition-colors"
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
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Security
								</Link>
							</li>
							<li>
								<Link
									href="/resources/support"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Support
								</Link>
							</li>
							<li>
								<Link
									href="/resources/roadmap"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Roadmap
								</Link>
							</li>
							<li>
								<Link
									href="/resources/brand-guidelines"
									className="text-muted-foreground hover:text-foreground transition-colors"
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
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href="https://discord.gg/osmynt"
									target="_blank"
									rel="noopener"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Discord
								</a>
							</li>
							<li>
								<a
									href="mailto:support@osmynt.dev"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Email
								</a>
							</li>
							<li>
								<a
									href="https://twitter.com/osmynt"
									target="_blank"
									rel="noopener"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Twitter
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
					<p>&copy; 2024 Osmynt. All rights reserved.</p>
					<p className="mt-2">Made with ❤️ for the developers, by the developers</p>
				</div>
			</div>
		</footer>
	);
}
