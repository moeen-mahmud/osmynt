import type { BuildOptions } from "esbuild";

const config: BuildOptions = {
	entryPoints: ["./src/extension.ts"],
	bundle: true,
	platform: "node",
	target: "node14",
	outdir: "./dist",
	outbase: "./src",
	outExtension: {
		".js": ".cjs",
	},
	format: "cjs",
	external: ["vscode"],
	tsconfig: "tsconfig.json",
	define: {
		// This will replace all instances of Bun.env.X with process.env.X at build time
		"Bun.env": "process.env",
		"Bun.env.NODE_ENV": "process.env.NODE_ENV",
		// If you need specific environment variables
		"Bun.env.API_ENDPOINT": JSON.stringify(process.env.API_ENDPOINT),
		"Bun.env.WEBSOCKET_ENDPOINT": JSON.stringify(process.env.WEBSOCKET_ENDPOINT),
	},
	loader: {
		".ts": "ts",
		".js": "js",
	},
	logLevel: "info",
};

export default config;
