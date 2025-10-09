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
