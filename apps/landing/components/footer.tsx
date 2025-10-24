import { OsmyntLogo } from "@/components/osmynt-logo";
import { Github, Mail } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto max-w-6xl">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<OsmyntLogo height={16} width={32} />
							<span className="text-xl font-bold">Osmynt</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Secure, Git-powered, real-time code sharing for developer teams.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a href="#features" className="hover:text-foreground transition-colors">
									Features
								</a>
							</li>
							<li>
								<a href="#security" className="hover:text-foreground transition-colors">
									Security
								</a>
							</li>
							<li>
								<a
									href="https://docs.osmynt.dev"
									className="hover:text-foreground transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									Documentation
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Resources</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a
									href="https://github.com/moeen-mahmud/osmynt"
									className="hover:text-foreground transition-colors"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href="https://github.com/moeen-mahmud/osmynt/issues"
									className="hover:text-foreground transition-colors"
								>
									Report Issues
								</a>
							</li>
							<li>
								<a
									href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt"
									className="hover:text-foreground transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									VS Code Marketplace
								</a>
							</li>
							<li>
								<a
									href="https://open-vsx.org/extension/osmynt/osmynt"
									className="hover:text-foreground transition-colors"
									target="_blank"
									rel="noopener noreferrer"
								>
									Open VSX Marketplace
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Connect</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<a
									href="mailto:support@osmynt.dev"
									className="hover:text-foreground transition-colors flex items-center gap-2"
								>
									<Mail className="h-4 w-4" />
									support@osmynt.dev
								</a>
							</li>
							<li>
								<a
									href="https://github.com/moeen-mahmud"
									className="hover:text-foreground transition-colors flex items-center gap-2"
								>
									<Github className="h-4 w-4" />
									@moeen-mahmud
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Osmynt. Licensed under AGPL-3.0.</p>
					<p>Made with ❤️ for developers, by developers</p>
				</div>
			</div>
		</footer>
	);
}
