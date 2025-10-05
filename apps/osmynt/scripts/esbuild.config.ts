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
	loader: {
		".ts": "ts",
		".js": "js",
	},
	logLevel: "info",
};

export default config;
