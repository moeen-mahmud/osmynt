"use client";

import { Zap, Shield, GitBranch, Users, Code, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
	{
		icon: Shield,
		title: "Military-Grade Encryption",
		description:
			"AES-256 encryption with zero-knowledge architecture. Your code is encrypted on your device before transmission, and we can never access your unencrypted content.",
	},
	{
		icon: Zap,
		title: "Lightning-Fast Sharing",
		description:
			"Share code blocks in milliseconds with real-time updates. See changes as they happen without refreshing or context switching between tools.",
	},
	{
		icon: GitBranch,
		title: "Native Git Integration",
		description:
			"Apply shared code changes directly to your files using Git's three-way merge algorithm. Maintain your commit history and workflow integrity.",
	},
	{
		icon: Users,
		title: "Enterprise Team Features",
		description:
			"Advanced team management with role-based permissions, audit logs, and compliance reporting. Built for teams of any size.",
	},
	{
		icon: Code,
		title: "Universal Language Support",
		description:
			"Syntax highlighting for 200+ programming languages with preserved formatting, indentation, and encoding. Works with any file type.",
	},
	{
		icon: Bell,
		title: "Intelligent Notifications",
		description:
			"Smart notifications that respect your focus time. Get notified about relevant code shares without interrupting your deep work.",
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
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for the modern development team</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Stop compromising between security and productivity. Osmynt delivers enterprise-grade encryption
						with developer-friendly features that keep you in your flow.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
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
