/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	compress: true,
	poweredByHeader: false,
	generateEtags: true,
	experimental: {
		optimizeCss: false,
	},
	headers: async () => [
		{
			source: "/(.*)",
			headers: [
				{
					key: "X-Frame-Options",
					value: "DENY",
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{
					key: "Referrer-Policy",
					value: "origin-when-cross-origin",
				},
				{
					key: "X-DNS-Prefetch-Control",
					value: "on",
				},
			],
		},
	],
};

export default nextConfig;
