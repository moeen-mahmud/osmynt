import type { BuildOptions } from "esbuild";

const config: BuildOptions = {
	entryPoints: ["./apps/osmynt/src/extension.ts"],
	bundle: true,
	platform: "node",
	outdir: "./apps/osmynt/dist",
	outbase: "./apps/osmynt/src",
	outExtension: {
		".js": ".cjs",
	},
	define: { 
		'process.env.ENGINE_BASE_URL': JSON.stringify(process.env.ENGINE_BASE_URL), 
		'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL), 
		'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY) 
	},
	format: "cjs",
	external: ["vscode"],
	tsconfig: "./apps/osmynt/tsconfig.json",
	loader: {
		".ts": "ts",
		".js": "js",
	},
	logLevel: "info",
};

export default config;
