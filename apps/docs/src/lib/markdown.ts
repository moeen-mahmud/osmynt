import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { visit } from "unist-util-visit";

const docsDirectory = path.join(process.cwd(), "src/content");

// Custom remark plugin to handle Jekyll-style relative URLs and fix relative paths
function remarkRelativeLinks() {
	return (tree: any) => {
		visit(tree, "link", node => {
			if (node.url && typeof node.url === "string") {
				// Handle Jekyll-style relative URLs: {{ '/path' | relative_url }}
				const jekyllMatch = node.url.match(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/);
				if (jekyllMatch) {
					node.url = jekyllMatch[1];
				}
				// Fix relative paths that don't start with / or http
				else if (
					!node.url.startsWith("/") &&
					!node.url.startsWith("http") &&
					!node.url.startsWith("#") &&
					!node.url.startsWith("mailto:")
				) {
					node.url = "/" + node.url;
				}
			}
		});
	};
}

export interface DocData {
	id: string;
	contentHtml: string;
	title?: string;
	description?: string;
	layout?: string;
	[key: string]: any;
}

export function getAllDocIds(): string[] {
	const fileNames = fs.readdirSync(docsDirectory);
	return fileNames.filter(name => name.endsWith(".md")).map(name => name.replace(/\.md$/, ""));
}

export function getDocData(id: string): DocData {
	const fullPath = path.join(docsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf8");

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	// Use remark to convert markdown into HTML string
	const processedContent = remark().use(remarkRelativeLinks).use(html).processSync(matterResult.content);
	const contentHtml = processedContent.toString();

	// Combine the data with the id and contentHtml
	return {
		id,
		contentHtml,
		...matterResult.data,
	};
}

export function getDocDataAsync(id: string): Promise<DocData> {
	const fullPath = path.join(docsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf8");

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	// Use remark to convert markdown into HTML string
	return remark()
		.use(remarkRelativeLinks)
		.use(html)
		.process(matterResult.content)
		.then(processedContent => ({
			id,
			contentHtml: processedContent.toString(),
			...matterResult.data,
		}));
}

export function getAllDocs(): DocData[] {
	const fileNames = fs.readdirSync(docsDirectory);
	const allDocsData = fileNames
		.filter(name => name.endsWith(".md"))
		.map(name => {
			const id = name.replace(/\.md$/, "");
			return getDocData(id);
		});

	return allDocsData;
}

export function getDocsByDirectory(directory: string): DocData[] {
	const dirPath = path.join(docsDirectory, directory);
	if (!fs.existsSync(dirPath)) {
		return [];
	}

	const fileNames = fs.readdirSync(dirPath);
	const allDocsData = fileNames
		.filter(name => name.endsWith(".md"))
		.map(name => {
			const id = name.replace(/\.md$/, "");
			const fullPath = path.join(dirPath, `${id}.md`);
			const fileContents = fs.readFileSync(fullPath, "utf8");
			const matterResult = matter(fileContents);

			const processedContent = remark().use(remarkRelativeLinks).use(html).processSync(matterResult.content);
			const contentHtml = processedContent.toString();

			return {
				id: `${directory}/${id}`,
				contentHtml,
				...matterResult.data,
			};
		});

	return allDocsData;
}
