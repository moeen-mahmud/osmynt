"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function CTA() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border" ref={ref}>
			<div className="container mx-auto max-w-4xl">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.5 }}
					className="text-center space-y-8 p-12 rounded-2xl border border-primary/30 bg-card hover:border-primary/50 transition-colors duration-300"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-balance">
						Stop compromising between security and productivity
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Join thousands of developers who've already upgraded their code sharing workflow. Install Osmynt
						and experience the difference in minutes.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button size="lg" className="gap-2 group" asChild>
							<a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">
								Install for VS Code
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</a>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a href="mailto:support@osmynt.dev">Contact Us</a>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
