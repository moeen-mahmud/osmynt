"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
	return (
		<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto max-w-5xl">
				<div className="text-center space-y-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground border border-border"
					>
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
						</span>
						Now in Beta
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
					>
						Share code securely,
						<br />
						<span className="text-primary">without breaking your flow</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
					>
						The only code sharing tool that combines end-to-end encryption, real-time collaboration, and
						native editor integration. No more context switching, no more security compromises.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="flex flex-col sm:flex-row items-center justify-center gap-4"
					>
						<Button size="lg" className="gap-2 group" asChild>
							<a href="https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt">
								Install for VS Code
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</a>
						</Button>
						<Button size="lg" variant="outline" className="gap-2 bg-transparent group" asChild>
							<a href="https://github.com/moeen-mahmud/osmynt">
								<Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
								View on GitHub
							</a>
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="pt-8"
					>
						<div className="relative rounded-lg border border-border bg-card p-4 sm:p-6 max-w-3xl mx-auto hover:border-primary/50 transition-colors duration-300">
							<div className="flex items-center gap-2 mb-4">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 rounded-full bg-red-500/80"></div>
									<div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
									<div className="h-3 w-3 rounded-full bg-green-500/80"></div>
								</div>
								<span className="text-xs text-muted-foreground font-mono ml-2">editor.tsx</span>
							</div>
							<pre className="text-left text-sm font-mono overflow-x-auto">
								<code className="text-muted-foreground">
									{`// Select code, share instantly
const shareCode = async () => {
  await osmynt.share({
    code: selectedText,
    team: "engineering",
    encrypted: true
  });
};`}
								</code>
							</pre>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
