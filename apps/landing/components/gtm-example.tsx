"use client";

import { Button } from "@/components/ui/button";
import { gtmEvent, gtmEngagement, gtmConversion } from "@/components/gtm";
import { useState } from "react";

/**
 * Example component demonstrating GTM tracking usage
 * This shows how to integrate GTM tracking into your components
 */
export function GTMExample() {
	const [clickCount, setClickCount] = useState(0);

	const handleInstallClick = () => {
		// Track the install button click
		gtmEvent("cta_click", {
			cta_type: "install_extension",
			cta_location: "hero_section",
			cta_text: "Install for VS Code",
		});

		// Track user engagement
		gtmEngagement("click", "cta", "install_button", 1);

		setClickCount(prev => prev + 1);
	};

	const handleContactClick = () => {
		// Track contact button click
		gtmEvent("contact_click", {
			contact_method: "email",
			contact_location: "hero_section",
		});

		gtmEngagement("click", "contact", "email_button", 1);
	};

	const handleScrollTracking = () => {
		// Track scroll engagement
		gtmEngagement("scroll", "user_interaction", "hero_section", 1);
	};

	const handleConversion = () => {
		// Track a conversion (example: user signs up)
		gtmConversion("SIGNUP_CONVERSION", 1, "USD");

		gtmEvent("conversion", {
			conversion_type: "signup",
			conversion_value: 1,
		});
	};

	return (
		<div className="space-y-4 p-6 border rounded-lg">
			<h3 className="text-lg font-semibold">GTM Tracking Examples</h3>

			<div className="space-y-2">
				<Button onClick={handleInstallClick}>Install Extension (Tracked: {clickCount})</Button>

				<Button variant="outline" onClick={handleContactClick}>
					Contact Us
				</Button>

				<Button variant="outline" onClick={handleScrollTracking}>
					Track Scroll Engagement
				</Button>

				<Button variant="outline" onClick={handleConversion}>
					Track Conversion
				</Button>
			</div>

			<p className="text-sm text-muted-foreground">
				Open browser dev tools and check the dataLayer array to see events being pushed.
			</p>
		</div>
	);
}
