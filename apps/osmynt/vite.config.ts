import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/browser/extension.ts"),
			name: "OsmyntBrowser",
			fileName: "extension",
			formats: ["cjs"], // Use CommonJS for VS Code web extension compatibility
		},
		rollupOptions: {
			external: ["vscode"],
			output: {
				globals: {
					vscode: "vscode",
				},
			},
		},
		outDir: "dist/browser",
		emptyOutDir: true,
		target: "es2020",
	},
	define: {
		"process.env.ENGINE_BASE_URL": JSON.stringify(process.env.ENGINE_BASE_URL || "http://localhost:3000"),
		"process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL || ""),
		"process.env.SUPABASE_ANON_KEY": JSON.stringify(process.env.SUPABASE_ANON_KEY || ""),
		"process.env.UPSTASH_REDIS_URL": JSON.stringify(process.env.UPSTASH_REDIS_URL || ""),
		"process.env": "{}", // Define process.env as empty object for browser compatibility
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	esbuild: {
		target: "es2020",
	},
});
