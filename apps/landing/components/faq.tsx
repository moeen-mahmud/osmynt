"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
	{
		question: "How does end-to-end encryption work in Osmynt?",
		answer: "Osmynt uses industry-standard AES-256 encryption to encrypt your code on your machine before it's transmitted. The encryption keys are generated locally using your device's secure random number generator and never leave your device. We implement a zero-knowledge architecture, meaning we cannot access your unencrypted code even if we wanted to. Each code share uses a unique encryption key, and only the intended recipients can decrypt the content.",
	},
	{
		question: "What encryption protocols and standards does Osmynt use?",
		answer: "Osmynt implements multiple layers of security: AES-256-GCM for symmetric encryption of code content, RSA-4096 for key exchange, and TLS 1.3 for transport security. We use industry-standard libraries like WebCrypto API and follow OWASP security guidelines. All cryptographic operations happen client-side, ensuring your private keys never leave your device.",
	},
	{
		question: "Is Osmynt free to use? What's the pricing model?",
		answer: "Yes, Osmynt is completely free during the beta period with no usage limits. We're focused on building the best possible experience for developer teams. Future pricing will include a free tier for individual developers with core features, and paid plans for teams and enterprises with advanced collaboration features, priority support, and enhanced security options.",
	},
	{
		question: "Which editors and IDEs does Osmynt support?",
		answer: "Currently, Osmynt is available as a VS Code extension with full feature support. We're actively developing extensions for JetBrains IDEs (IntelliJ, WebStorm, PyCharm), Sublime Text, and Vim/Neovim. The roadmap also includes support for Visual Studio, Atom, and other popular editors. Each extension will maintain feature parity with the VS Code version.",
	},
	{
		question: "How do I set up a team and invite members?",
		answer: "Creating a team is simple: use the 'Osmynt: Create Team' command in VS Code, give your team a name, and you'll receive a secure invite link. Share this link with your colleagues, and they can join using 'Osmynt: Join Team' command. Team admins can manage member permissions, view activity logs, and configure team-specific settings like code retention policies.",
	},
	{
		question: "Can I share code with people outside my team?",
		answer: "Absolutely! You can share code with anyone using secure share links, even if they're not part of your team. Recipients need to have Osmynt installed to view and apply the shared code. You can set expiration times, require authentication, and even add password protection for sensitive code. All sharing maintains the same end-to-end encryption regardless of team membership.",
	},
	{
		question: "What happens to my shared code? How long is it stored?",
		answer: "Shared code is stored encrypted on our servers for a configurable period (default 7 days, maximum 30 days). After expiration, the encrypted data is permanently deleted using secure deletion methods. You can manually delete shared code anytime from the Osmynt dashboard. We never store unencrypted code, and our servers can't decrypt your content even if compromised.",
	},
	{
		question: "Does Osmynt work offline? What about low-connectivity environments?",
		answer: "Osmynt requires an internet connection for real-time sharing and receiving new code. However, you can view previously received code snippets offline, and we're developing offline-first features for future releases. This includes local caching of recent shares, offline diff viewing, and sync capabilities when connectivity is restored.",
	},
	{
		question: "How does Osmynt's Git integration work?",
		answer: "Osmynt provides native Git integration that allows you to apply shared code changes directly to your files using Git's three-way merge algorithm. When you receive shared code, you can preview the diff, choose which changes to apply, and commit them to your repository. This maintains your Git history and allows for proper code review workflows.",
	},
	{
		question: "What programming languages and file types does Osmynt support?",
		answer: "Osmynt supports all programming languages and file types. We provide syntax highlighting for over 200 languages, including JavaScript, Python, Java, C++, Go, Rust, TypeScript, and more. The system preserves original formatting, indentation, and encoding. Binary files are also supported with base64 encoding for secure transmission.",
	},
	{
		question: "How does Osmynt handle large codebases and performance?",
		answer: "Osmynt is optimized for performance with large codebases. We support files up to 10MB per share, with intelligent chunking for larger files. The system uses delta compression to minimize bandwidth usage, and we implement smart caching to reduce repeated transfers. For very large shares, we provide progress indicators and resume capabilities.",
	},
	{
		question: "What security measures protect against data breaches?",
		answer: "Osmynt implements multiple security layers: end-to-end encryption, zero-knowledge architecture, secure key exchange, and regular security audits. We use industry-standard practices like secure coding, dependency scanning, and penetration testing. Our infrastructure follows SOC 2 compliance standards, and we're working towards ISO 27001 certification.",
	},
	{
		question: "How does Osmynt compare to GitHub Gists, Slack, and other solutions?",
		answer: "Unlike GitHub Gists (public, no encryption), Slack (transport encryption only), or email (no real-time collaboration), Osmynt provides end-to-end encryption, real-time collaboration, and native editor integration. We're the only solution that combines security, real-time features, and seamless workflow integration without context switching.",
	},
	{
		question: "Can I use Osmynt in enterprise environments with compliance requirements?",
		answer: "Yes, Osmynt is designed for enterprise use with features like audit logs, compliance reporting, and administrative controls. We support SSO integration, LDAP authentication, and can be deployed in private cloud environments. Our enterprise plans include dedicated support, custom retention policies, and compliance documentation for SOC 2, HIPAA, and other standards.",
	},
	{
		question: "What happens if I lose access to my device or forget my encryption keys?",
		answer: "Osmynt uses a secure key recovery system that allows you to regenerate access to your shares without compromising security. You can set up recovery codes during initial setup, and team admins can help restore access to team shares. However, we cannot recover your private keys, so it's important to securely store your recovery information.",
	},
	{
		question: "How does Osmynt handle version control and code history?",
		answer: "Osmynt maintains a complete history of all code shares with version tracking. You can view previous versions, see who made changes, and track the evolution of shared code. The system integrates with your existing Git workflow, allowing you to see how shared code fits into your commit history and branch structure.",
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
