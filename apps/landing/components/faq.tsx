"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
	{
		question: "How does end-to-end encryption work in Osmynt?",
		answer: "Osmynt uses industry-standard encryption protocols to encrypt your code on your machine before it's transmitted. The encryption keys are generated locally and never leave your device, ensuring that only you and your intended recipients can read the shared code. We use a zero-knowledge architecture, meaning we cannot access your code even if we wanted to.",
	},
	{
		question: "Is Osmynt free to use?",
		answer: "Yes, Osmynt is currently free to use during the beta period. We're focused on building the best possible experience for developer teams. Pricing plans for teams and enterprises will be announced in the future, but individual developers will always have access to core features.",
	},
	{
		question: "Which editors does Osmynt support?",
		answer: "Currently, Osmynt is available as a VS Code extension. Support for other popular editors like JetBrains IDEs, Sublime Text, and Vim is on our roadmap. You can install Osmynt from the VS Code Marketplace and start sharing code instantly.",
	},
	{
		question: "How do I invite team members?",
		answer: "You can create or join a team directly from the VS Code command palette. Use the 'Osmynt: Create Team' command to set up a new team, then share the team invite link with your colleagues. Team members can join using the 'Osmynt: Join Team' command and entering the invite code.",
	},
	{
		question: "Can I share code with people outside my team?",
		answer: "Yes! While teams provide a convenient way to organize frequent collaborators, you can share code with anyone by generating a secure share link. The recipient doesn't need to be part of your team, but they will need to have Osmynt installed to view and apply the shared code.",
	},
	{
		question: "What happens to my shared code?",
		answer: "Shared code is stored encrypted on our servers for a limited time (default 7 days) to enable real-time collaboration. After the expiration period, the encrypted data is permanently deleted. You can also manually delete shared code at any time from the Osmynt dashboard.",
	},
	{
		question: "Does Osmynt work offline?",
		answer: "Osmynt requires an internet connection to share and receive code in real-time. However, you can view previously received code snippets offline. We're exploring offline-first features for future releases to improve the experience in low-connectivity environments.",
	},
	{
		question: "How is Osmynt different from GitHub Gists?",
		answer: "While GitHub Gists are great for public code sharing, Osmynt is designed for secure, real-time collaboration within teams. Key differences include end-to-end encryption, Git-powered diff application directly in your editor, real-time updates, and team-based access control. Osmynt keeps you in your development flow without context switching.",
	},
];

export function FAQ() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border" ref={ref}>
			<div className="container mx-auto max-w-3xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
					<p className="text-lg text-muted-foreground">Everything you need to know about Osmynt</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Accordion type="single" collapsible className="w-full">
						{faqs.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger className="text-left hover:text-primary transition-colors">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	);
}
