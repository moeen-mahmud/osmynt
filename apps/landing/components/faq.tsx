"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
	{
		question: "How does end-to-end encryption work in Osmynt?",
		answer: "Osmynt uses industry-standard encryption to encrypt your code on your machine before it's transmitted. The encryption keys are generated locally and never leave your device. We implement a zero-knowledge architecture, meaning we cannot access your unencrypted code even if we wanted to. Only the intended team members can decrypt the content.",
	},
	{
		question: "Is Osmynt free to use?",
		answer: "Yes, Osmynt is completely free during the beta period with no usage limits. We're focused on building the best possible experience for developer teams. Future pricing will include a free tier for individual developers with core features, and paid plans for teams and enterprises with advanced collaboration features.",
	},
	{
		question: "Which editors and IDEs does Osmynt support?",
		answer: "Currently, Osmynt is available as a VS Code extension with full feature support. We're actively developing extensions for JetBrains IDEs (IntelliJ, WebStorm, PyCharm), Sublime Text, and Vim/Neovim. The roadmap also includes support for Visual Studio, Atom, and other popular editors. Each extension will maintain feature parity with the VS Code version.",
	},
	{
		question: "How do I get started with Osmynt?",
		answer: "Getting started is simple: 1) Install the Osmynt extension from the VS Code Marketplace, 2) Use 'Osmynt: Login' to authenticate with GitHub, 3) Use 'Osmynt: Accept Invitation' to join an existing team or 'Osmynt: Invite Member' to invite others, 4) Select code in your editor and use 'Osmynt: Share Selected Code' to share with your team.",
	},
	{
		question: "How does team collaboration work in Osmynt?",
		answer: "Osmynt is built for team collaboration. You can invite team members using 'Osmynt: Invite Member' which generates an invitation token. Team members join using 'Osmynt: Accept Invitation'. Once in a team, you can share code with specific team members or the entire team. All sharing is encrypted and secure.",
	},
	{
		question: "What happens to my shared code?",
		answer: "Shared code is stored encrypted on our servers temporarily to enable real-time collaboration. The data is encrypted and we cannot read it. You can view shared code using 'Osmynt: View Code blocks' and apply changes using 'Osmynt: Apply Diff'. The system maintains your code's security while enabling seamless team collaboration.",
	},
	{
		question: "Does Osmynt work offline? What about low-connectivity environments?",
		answer: "Osmynt requires an internet connection for real-time sharing and receiving new code. However, you can view previously received code snippets offline, and we're developing offline-first features for future releases. This includes local caching of recent shares, offline diff viewing, and sync capabilities when connectivity is restored.",
	},
	{
		question: "How does Osmynt's diff application work?",
		answer: "Osmynt provides Git-like diff application that allows you to apply shared code changes directly to your files. When you receive shared code with full context, you can use 'Osmynt: Apply Diff' to preview and apply changes. This maintains your development workflow while enabling seamless code collaboration.",
	},
	{
		question: "What programming languages does Osmynt support?",
		answer: "Osmynt supports all programming languages and file types. We provide syntax highlighting for over 200 languages, including JavaScript, Python, Java, C++, Go, Rust, TypeScript, and more. The system preserves original formatting, indentation, and encoding for optimal code readability.",
	},
	{
		question: "How does device management work in Osmynt?",
		answer: "Osmynt supports multiple devices per team member. You can add devices using 'Osmynt: Add Device (Primary)' or 'Osmynt: Add Device (Companion)', list devices with 'Osmynt: List Devices', and remove devices with 'Osmynt: Remove Device'. This enables sharing code across all your development devices securely. In beta, you can add up to 2 devices at a time. We're working on increasing the limit in the future.",
	},
	{
		question: "What security measures protect my code?",
		answer: "Osmynt implements multiple security layers: end-to-end encryption, zero-knowledge architecture, secure key exchange, and team-only sharing. We use industry-standard practices and all cryptographic operations happen client-side. Your code is encrypted before transmission and only intended recipients can decrypt it.",
	},
	{
		question: "How does Osmynt compare to GitHub Gists, Slack, and other solutions?",
		answer: "Unlike GitHub Gists (public, no encryption), Slack (transport encryption only), or email (no real-time collaboration), Osmynt provides end-to-end encryption, real-time collaboration, and native editor integration. We're the only solution that combines security, real-time features, and seamless workflow integration without context switching.",
	},
	{
		question: "Can I use Osmynt for pair programming?",
		answer: "Absolutely! Osmynt is perfect for pair programming. You can share code blocks in real-time with your team members, see their changes instantly, and apply diffs directly to your files. The real-time collaboration features make it ideal for live coding sessions and collaborative debugging.",
	},
	{
		question: "What if I need to troubleshoot device issues?",
		answer: "Osmynt provides several troubleshooting commands: 'Osmynt: Repair This Device' to fix device registration issues, 'Osmynt: Clear Local Cache' to reset local settings, and 'Osmynt: Force Remove Device' for advanced device management. These tools help resolve connectivity and authentication issues.",
	},
	{
		question: "How do I manage team members in Osmynt?",
		answer: "Team management is straightforward: use 'Osmynt: Invite Member' to add new team members, 'Osmynt: Remove Member' to remove team members, and 'Osmynt: Accept Invitation' to join teams. The system maintains secure team relationships and enables seamless collaboration between team members.",
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
							<AccordionItem key={faq.question} value={`item-${index}`}>
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
