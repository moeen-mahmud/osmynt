"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function RebrandBanner() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Check if user has dismissed the banner
		const dismissed = localStorage.getItem("osmynt-rebrand-banner-dismissed");
		if (!dismissed) {
			setIsVisible(true);
		}
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem("osmynt-rebrand-banner-dismissed", "true");
	};

	useEffect(() => {
		if (isVisible) {
			document.body.style.paddingTop = "48px";
		} else {
			document.body.style.paddingTop = "0";
		}

		return () => {
			document.body.style.paddingTop = "0";
		};
	}, [isVisible]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -100, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed top-0 left-0 right-0 z-[100] bg-[#1A1A1A] border-b border-white/10"
				>
					<div className="container mx-auto px-4 py-3 flex items-center justify-center relative">
						<p className="text-sm text-white/90 text-center">
							<span className="font-medium">TurboGist is now Osmynt 🚀</span>
							{/* <span className="mx-2 text-white/50">•</span>
							<span className="text-white/70">
								Same powerful code sharing, new name and enhanced security
							</span> */}
						</p>
						<button
							type="button"
							onClick={handleDismiss}
							className="absolute right-4 p-1 hover:bg-white/10 rounded transition-colors"
							aria-label="Dismiss banner"
						>
							<X className="w-4 h-4 text-white/70" />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
