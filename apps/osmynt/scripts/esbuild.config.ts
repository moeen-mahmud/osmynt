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
	define: { 
		'process.env.ENGINE_BASE_URL': JSON.stringify(process.env.ENGINE_BASE_URL), 
		'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL), 
		'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
		'process.env.UPSTASH_REDIS_URL': JSON.stringify(process.env.UPSTASH_REDIS_URL)
	},
	format: "cjs",
	external: ["vscode"],
	tsconfig: "tsconfig.json",
	loader: {
		".ts": "ts",
		".js": "js",
	},
	logLevel: "info",
};

export default config;
