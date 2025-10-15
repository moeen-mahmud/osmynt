"use client";

import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const solutions = [
	{
		name: "Osmynt",
		description: "Secure, real-time code sharing",
		features: {
			encryption: "end-to-end",
			realTime: "yes",
			editorIntegration: "native",
			teamCollaboration: "built-in",
			gitLikeDiffSupport: "full",
			offlineSupport: "limited",
			cost: "free",
			setup: "instant",
		},
	},
	{
		name: "GitHub Gists",
		description: "Public code snippets",
		features: {
			encryption: "none",
			realTime: "no",
			editorIntegration: "none",
			teamCollaboration: "basic",
			gitLikeDiffSupport: "yes",
			offlineSupport: "yes",
			cost: "free",
			setup: "account required",
		},
	},
	{
		name: "Slack/Teams",
		description: "Chat-based sharing",
		features: {
			encryption: "transport",
			realTime: "yes",
			editorIntegration: "none",
			teamCollaboration: "basic",
			gitLikeDiffSupport: "none",
			offlineSupport: "limited",
			cost: "paid",
			setup: "complex",
		},
	},
	{
		name: "Email",
		description: "Traditional file sharing",
		features: {
			encryption: "optional",
			realTime: "no",
			editorIntegration: "none",
			teamCollaboration: "basic",
			gitLikeDiffSupport: "none",
			offlineSupport: "yes",
			cost: "free",
			setup: "simple",
		},
	},
	{
		name: "Screen Sharing",
		description: "Live screen sessions",
		features: {
			encryption: "transport",
			realTime: "yes",
			editorIntegration: "none",
			teamCollaboration: "basic",
			gitLikeDiffSupport: "none",
			offlineSupport: "no",
			cost: "paid",
			setup: "complex",
		},
	},
];

const featureLabels = {
	encryption: "Security",
	realTime: "Real-time",
	editorIntegration: "Editor Integration",
	teamCollaboration: "Team Features",
	gitLikeDiffSupport: "Git-diff Support",
	offlineSupport: "Offline Support",
	// cost: "Cost",
	setup: "Setup Complexity",
};

const getFeatureIcon = (value: string) => {
	if (
		value === "yes" ||
		value === "end-to-end" ||
		value === "full" ||
		value === "built-in" ||
		value === "native" ||
		value === "free" ||
		value === "instant"
	) {
		return <Check className="h-4 w-4 text-green-500" />;
	}
	if (value === "no" || value === "none" || value === "paid" || value === "complex") {
		return <X className="h-4 w-4 text-red-500" />;
	}
	if (
		value === "limited" ||
		value === "basic" ||
		value === "transport" ||
		value === "optional" ||
		value === "account required" ||
		value === "simple"
	) {
		return <Minus className="h-4 w-4 text-yellow-500" />;
	}
	return <Minus className="h-4 w-4 text-gray-400" />;
};

const getFeatureText = (value: string) => {
	const textMap: Record<string, string> = {
		"end-to-end": "End-to-End",
		"built-in": "Built-in",
		transport: "Transport Only",
		optional: "Optional",
		none: "None",
		yes: "Yes",
		no: "No",
		limited: "Limited",
		native: "Native",
		basic: "Basic",
		full: "Full",
		free: "Free",
		paid: "Paid",
		instant: "Instant",
		simple: "Simple",
		complex: "Complex",
		"account required": "Account Required",
	};
	return textMap[value] || value;
};

export function Comparison() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border" ref={ref}>
			<div className="container mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">How Osmynt compares to other solutions</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Compare Osmynt to other solutions for code sharing.
						{/* See why developer teams are choosing Osmynt over traditional code sharing methods. */}
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="overflow-x-auto"
				>
					<div className="min-w-[800px]">
						{/* Header */}
						<div className="grid grid-cols-6 gap-4 mb-6">
							<div className="text-sm font-medium text-muted-foreground">Feature</div>
							{solutions.map((solution, index) => (
								<div
									key={solution.name}
									className={`text-center ${index === 0 ? "bg-primary/10 rounded-lg p-3" : ""}`}
								>
									<div className={`font-semibold ${index === 0 ? "text-primary" : ""}`}>
										{solution.name}
									</div>
									<div className="text-xs text-muted-foreground mt-1">{solution.description}</div>
								</div>
							))}
						</div>

						{/* Features */}
						<div className="space-y-4">
							{Object.entries(featureLabels).map(([key, label]) => (
								<div
									key={key}
									className="grid grid-cols-6 gap-4 items-center py-3 border-b border-border/50"
								>
									<div className="text-sm font-medium">{label}</div>
									{solutions.map((solution, solutionIndex) => {
										const value = solution.features[key as keyof typeof solution.features];
										const isOsmynt = solutionIndex === 0;
										return (
											<div
												key={solution.name}
												className={`text-center ${isOsmynt ? "bg-primary/5 rounded-lg p-2" : ""}`}
											>
												<div className="flex items-center justify-center gap-2 mb-1">
													{getFeatureIcon(value)}
													<span
														className={`text-sm ${isOsmynt ? "font-medium text-primary" : ""}`}
													>
														{getFeatureText(value)}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="mt-12 text-center"
				>
					<div className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-2xl mx-auto">
						<h3 className="text-xl font-semibold mb-2 text-primary">Why choose Osmynt?</h3>
						<p className="text-muted-foreground">
							Osmynt is the only solution that combines end-to-end encryption, real-time collaboration,
							and native editor integration. Built specifically for developer teams who value security and
							productivity.
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
