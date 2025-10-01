import { Scalar } from "@scalar/hono-api-reference";
import { Routes } from "@/config/routes.config";

export const scalarConfig = Scalar({
	_integration: "hono",
	darkMode: true,
	theme: "purple",
	sources: [
		{
			title: "Osmynt API Reference",
			url: `${Routes.basePath}${Routes.doc}`,
		},
	],
	metaData: {
		title: "Osmynt API Reference",
	},
	customCss: `
			body { 
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
			}
		`,
});
