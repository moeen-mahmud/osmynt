"use client";

import { Mail, MessageSquare, Monitor, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
	{
		icon: Mail,
		title: "Email destroys code formatting",
		description:
			"Code snippets lose syntax highlighting, indentation, and context. Email threads become unreadable messes that waste everyone's time.",
	},
	{
		icon: MessageSquare,
		title: "Chat tools weren't built for code",
		description:
			"Slack and Teams messages have terrible readability, no syntax highlighting, and make code reviews impossible. Your team's productivity suffers.",
	},
	{
		icon: Monitor,
		title: "Screen sharing kills focus",
		description:
			"Requires scheduling, breaks deep work, and wastes hours of valuable development time. Your flow state is constantly interrupted.",
	},
	{
		icon: Link2,
		title: "Context switching is expensive",
		description:
			"Jumping between tools, copying links, and managing multiple platforms creates cognitive overhead that compounds over time.",
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
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">
						The code sharing problem is costing you productivity
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Every day, developers lose hours to inefficient code sharing methods. Security risks, context
						switching, and broken workflows are the hidden costs of outdated tools.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{problems.map((problem, index) => (
						<motion.div
							key={problem.title}
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
