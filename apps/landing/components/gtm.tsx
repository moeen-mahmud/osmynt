"use client";

import Script from "next/script";

interface GTMProps {
	gtmId: string;
}

interface GAProps {
	gaId: string;
}

export function GoogleTagManager({ gtmId }: GTMProps) {
	return (
		<>
			{/* GTM Head Script */}
			<Script
				id="gtm-head"
				strategy="afterInteractive"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: false positive
				dangerouslySetInnerHTML={{
					__html: `
						(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${gtmId}');
					`,
				}}
			/>
		</>
	);
}

export function GoogleAnalytics({ gaId }: GAProps) {
	return (
		<>
			{/* Google Analytics Script */}
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
			<Script
				id="google-analytics"
				strategy="afterInteractive"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: false positive
				dangerouslySetInnerHTML={{
					__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${gaId}');
					`,
				}}
			/>
		</>
	);
}

export function GTMNoScript({ gtmId }: GTMProps) {
	return (
		<noscript>
			{/** biome-ignore lint/a11y/useIframeTitle: False positive */}
			<iframe
				src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
				height="0"
				width="0"
				style={{ display: "none", visibility: "hidden" }}
			/>
		</noscript>
	);
}

// Helper function to push events to GTM data layer
export function gtmPush(data: Record<string, any>) {
	if (typeof window !== "undefined" && window.dataLayer) {
		window.dataLayer?.push(data);
	}
}

// Helper function to track page views
export function gtmPageView(url: string) {
	gtmPush({
		event: "page_view",
		page_location: url,
	});
}

// Helper function to track custom events
export function gtmEvent(eventName: string, parameters?: Record<string, any>) {
	gtmPush({
		event: eventName,
		...parameters,
	});
}

// Helper function to track conversions
export function gtmConversion(conversionId: string, value?: number, currency?: string) {
	gtmPush({
		event: "conversion",
		conversion_id: conversionId,
		value: value,
		currency: currency,
	});
}

// Helper function to track e-commerce events
export function gtmPurchase(transactionId: string, value: number, currency: string, items: any[]) {
	gtmPush({
		event: "purchase",
		transaction_id: transactionId,
		value: value,
		currency: currency,
		items: items,
	});
}

// Helper function to track user engagement
export function gtmEngagement(action: string, category: string, label?: string, value?: number) {
	gtmPush({
		event: "engagement",
		engagement_action: action,
		engagement_category: category,
		engagement_label: label,
		engagement_value: value,
	});
}

// TypeScript declaration for dataLayer
declare global {
	interface Window {
		dataLayer: any[];
	}
}
