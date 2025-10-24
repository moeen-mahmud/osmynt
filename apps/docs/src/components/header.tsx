"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { OsmyntLogo } from "@/components/ui/osmynt-logo";
import { SidebarTrigger } from "@/components/sidebar";
import { version } from "../../package.json";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-4">
						<SidebarTrigger className="lg:hidden" />
						<div className="flex items-center gap-2">
							<Link href="/" className="flex items-center gap-2">
								<OsmyntLogo />
								<span className="text-xl font-bold">Osmynt</span>
							</Link>
							<span className="text-muted-foreground text-sm">v{version}</span>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<Button variant="secondary" size="sm" className="hidden lg:inline-flex" asChild>
							<a href="https://github.com/moeen-mahmud/osmynt" target="_blank" rel="noopener">
								<Github className="h-4 w-4 mr-2" />
								GitHub
							</a>
						</Button>
						{/* <Button size="sm" className="hidden lg:inline-flex" asChild>
							<a href="https://discord.gg/osmynt" target="_blank" rel="noopener">
								<MessageCircle className="h-4 w-4 mr-2" />
								Discord
							</a>
						</Button> */}
					</div>
				</div>
			</div>
		</header>
	);
}
