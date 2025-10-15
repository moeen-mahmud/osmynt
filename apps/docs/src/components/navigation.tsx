"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const navigation = [
	{
		title: "Getting Started",
		href: "/getting-started",
		items: [
			{ title: "Installation", href: "/getting-started/installation" },
			{ title: "Authentication", href: "/getting-started/authentication" },
			{ title: "Teams", href: "/getting-started/teams" },
			{ title: "Your First Share", href: "/getting-started/first-share" },
		],
	},
	{
		title: "Features",
		href: "/features",
		items: [
			{ title: "Code Sharing", href: "/features/code-sharing" },
			{ title: "Team Management", href: "/features/team-management" },
			{ title: "Device Management", href: "/features/device-management" },
			{ title: "Diff Application", href: "/features/diff-application" },
			{ title: "Real-time Updates", href: "/features/realtime-updates" },
		],
	},
	{
		title: "Reference",
		href: "/reference",
		items: [
			{ title: "Commands", href: "/reference/commands" },
			{ title: "Keyboard Shortcuts", href: "/reference/shortcuts" },
			{ title: "Configuration", href: "/reference/configuration" },
		],
	},
	{
		title: "Troubleshooting",
		href: "/troubleshooting",
		items: [
			{ title: "Common Issues", href: "/troubleshooting/common-issues" },
			{ title: "Device Problems", href: "/troubleshooting/device-problems" },
			{ title: "Connection Issues", href: "/troubleshooting/connection-issues" },
			{ title: "Performance", href: "/troubleshooting/performance" },
		],
	},
	{
		title: "Security",
		href: "/security",
		items: [
			{ title: "Overview", href: "/security/overview" },
			{ title: "Encryption", href: "/security/encryption" },
			{ title: "Best Practices", href: "/security/best-practices" },
		],
	},
	{
		title: "Resources",
		href: "/resources",
		items: [
			{ title: "Brand Guidelines", href: "/resources/brand-guidelines" },
			{ title: "Development Roadmap", href: "/resources/roadmap" },
			{ title: "Support", href: "/resources/support" },
		],
	},
];

export function Navigation() {
	const pathname = usePathname();

	return (
		<aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card overflow-y-auto scrollbar-thin">
			<nav className="p-4 space-y-6">
				{navigation.map(section => (
					<div key={section.title}>
						<Link
							href={section.href}
							className={cn(
								"flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
								pathname === section.href
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:text-foreground hover:bg-muted"
							)}
						>
							{section.title}
							<ChevronRight className="h-4 w-4" />
						</Link>
						<div className="mt-2 space-y-1">
							{section.items.map(item => (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"block px-3 py-2 text-sm rounded-md transition-colors",
										pathname === item.href
											? "bg-primary/10 text-primary font-medium"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
									)}
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>
				))}
			</nav>
		</aside>
	);
}
