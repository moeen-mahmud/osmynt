"use client";

import { Mail, MessageSquare, Monitor, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
	{
		icon: Mail,
		title: "Email breaks formatting",
		description: "Code snippets lose syntax highlighting and context gets lost in email threads.",
	},
	{
		icon: MessageSquare,
		title: "Chat tools lack context",
		description: "Slack and Teams messages have poor readability and no proper code formatting.",
	},
	{
		icon: Monitor,
		title: "Screen sharing disrupts flow",
		description: "Requires scheduling, breaks concentration, and wastes valuable development time.",
	},
	{
		icon: Link2,
		title: "Third-party platforms are complex",
		description: "Context switching between tools kills productivity and slows down collaboration.",
	},
];

export function Problem() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border" ref={ref}>
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">Traditional code sharing is broken</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Developers waste hours every week fighting with tools that weren't built for code collaboration.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{problems.map((problem, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors group"
						>
							<problem.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
							<h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
							<p className="text-muted-foreground">{problem.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
