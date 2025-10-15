import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Osmynt - Secure Code Sharing for Developer Teams",
		short_name: "Osmynt",
		description:
			"End-to-end encrypted, real-time code sharing directly in your editor. No context switching, no workflow disruption.",
		start_url: "/",
		display: "standalone",
		background_color: "#1A1A1A",
		theme_color: "#39FF14",
		icons: [
			{
				src: "/osmynt-128x.png",
				sizes: "128x128",
				type: "image/png",
			},
			{
				src: "/osmynt-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/osmynt-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		categories: ["developer", "productivity", "security"],
		lang: "en",
		orientation: "portrait",
	};
}
