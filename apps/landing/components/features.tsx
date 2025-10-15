"use client";

import { Zap, Shield, GitBranch, Users, Code, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
	{
		icon: Shield,
		title: "End-to-End Encryption",
		description:
			"Your code is encrypted before leaving your machine. Zero-knowledge architecture means we can't read your code.",
	},
	{
		icon: Zap,
		title: "Real-time Sharing",
		description:
			"Share code blocks instantly with your team. See updates in real-time without leaving your editor.",
	},
	{
		icon: GitBranch,
		title: "Git-powered Diffs",
		description: "Apply shared code changes directly to your files with Git-like diff application.",
	},
	{
		icon: Users,
		title: "Team-first Design",
		description: "Built for developer teams. Invite members, join teams, and collaborate securely.",
	},
	{
		icon: Code,
		title: "Syntax Highlighting",
		description: "Preserve code formatting and readability with full syntax highlighting support.",
	},
	{
		icon: Bell,
		title: "Smart Notifications",
		description: "Get notified when team members share code with you. Never miss important updates.",
	},
];

export function Features() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border" ref={ref}>
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need for secure code sharing</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Osmynt brings seamless, encrypted collaboration directly into your development workflow.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="space-y-3 group"
						>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
								<feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
							</div>
							<h3 className="text-xl font-semibold">{feature.title}</h3>
							<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
