"use client";

import { Lock, Key, UserCheck, Database, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const securityFeatures = [
	{
		icon: Lock,
		title: "Zero-knowledge Architecture",
		description:
			"Your code is encrypted on your device before transmission. We never have access to your unencrypted code.",
	},
	{
		icon: Key,
		title: "Cryptographic Verification",
		description: "Secure handshakes ensure you're sharing with the right people. Every share is verified.",
	},
	{
		icon: UserCheck,
		title: "Team-only Sharing",
		description: "Code can only be shared with verified team members. No public sharing, no data leaks.",
	},
	{
		icon: Database,
		title: "No Data Retention",
		description: "Shared code is not stored on our servers. Your code stays in your control.",
	},
];

export function Security() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="security" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border" ref={ref}>
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm text-primary border border-primary/20 mb-6">
						<Shield className="h-4 w-4" />
						Security First
					</div>
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">Built with security at the core</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Enterprise-grade encryption and security practices to keep your code safe.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{securityFeatures.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="p-6 rounded-lg border border-border bg-card group hover:border-primary/50 transition-colors"
						>
							<div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
								<feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
							</div>
							<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
							<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
