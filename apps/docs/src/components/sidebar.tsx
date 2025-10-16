"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Zap, Settings, Bug, Shield, HelpCircle } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { version } from "../../package.json";

const navigation = [
	{
		title: "Getting Started",
		href: "/getting-started",
		icon: BookOpen,
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
		icon: Zap,
		items: [
			{ title: "Code Sharing", href: "/features/code-sharing" },
			{ title: "Team Management", href: "/features/team-management" },
			{ title: "Device Management", href: "/features/device-management" },
			{ title: "Diff Application", href: "/features/diff-application" },
			{ title: "Language Support", href: "/features/language-support" },
			{ title: "Notifications", href: "/features/notifications" },
			{ title: "Real-time Updates", href: "/features/realtime-updates" },
		],
	},
	{
		title: "Reference",
		href: "/reference",
		icon: Settings,
		items: [
			{ title: "Commands", href: "/reference/commands" },
			{ title: "Command Access", href: "/reference/shortcuts" },
			{ title: "Configuration", href: "/reference/configuration" },
		],
	},
	{
		title: "Security",
		href: "/security",
		icon: Shield,
		items: [
			{ title: "Overview", href: "/security/overview" },
			{ title: "Encryption", href: "/security/encryption" },
			{ title: "Best Practices", href: "/security/best-practices" },
		],
	},
	{
		title: "Troubleshooting",
		href: "/troubleshooting",
		icon: Bug,
		items: [
			{ title: "Common Issues", href: "/troubleshooting/common-issues" },
			{ title: "Device Problems", href: "/troubleshooting/device-problems" },
			{ title: "Connection Issues", href: "/troubleshooting/connection-issues" },
			{ title: "Performance", href: "/troubleshooting/performance" },
		],
	},
	{
		title: "Resources",
		href: "/resources",
		icon: HelpCircle,
		items: [
			// { title: "Brand Guidelines", href: "/resources/brand-guidelines" },
			{ title: "Development Roadmap", href: "/resources/roadmap" },
			{ title: "Support", href: "/resources/support" },
		],
	},
];

function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<BookOpen className="h-4 w-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">Osmynt</span>
						<span className="truncate text-xs text-muted-foreground">Documentation</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					{/* <SidebarGroupLabel>Documentation</SidebarGroupLabel> */}
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation.map(section => (
								<SidebarMenuItem key={section.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === section.href}
										tooltip={section.title}
									>
										<Link href={section.href}>
											<section.icon className="h-4 w-4" />
											<span>{section.title}</span>
										</Link>
									</SidebarMenuButton>
									{section.items && section.items.length > 0 && (
										<SidebarMenuSub>
											{section.items.map(item => (
												<SidebarMenuSubItem key={item.href}>
													<SidebarMenuSubButton asChild isActive={pathname === item.href}>
														<Link href={item.href}>
															<span>{item.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="p-4 text-xs text-muted-foreground">Doc Version: v{version}</div>
			</SidebarFooter>
		</Sidebar>
	);
}

export function DocsSidebar() {
	return <AppSidebar />;
}

export { SidebarTrigger };
