import { notFound } from "next/navigation";
import { getDocData, getDocsByDirectory, type DocData } from "@/lib/markdown";
import fs from "fs";
import path from "path";

interface PageProps {
	params: {
		slug: string[];
	};
}

export default function DocPage({ params }: PageProps) {
	const { slug } = params;

	// Try to find the markdown file
	let docData: DocData | undefined;

	try {
		// First try as a single file
		if (slug.length === 1) {
			docData = getDocData(slug[0]);
		} else {
			// Try as a directory structure
			const directory = slug.slice(0, -1).join("/");
			const fileName = slug[slug.length - 1];
			const docs = getDocsByDirectory(directory);
			docData = docs.find(doc => doc.id.endsWith(`/${fileName}`));
		}
	} catch (error) {
		notFound();
	}

	if (!docData) {
		notFound();
	}

	return (
		<div className="prose prose-lg max-w-none">
			{/** biome-ignore lint/security/noDangerouslySetInnerHtml: false positive */}
			<div className="markdown-content" dangerouslySetInnerHTML={{ __html: docData.contentHtml }} />
		</div>
	);
}

// Generate static params for all markdown files
export async function generateStaticParams() {
	const docsDirectory = path.join(process.cwd(), "src/content");
	const allPaths: string[][] = [];

	function scanDirectory(dir: string, currentPath: string[] = []) {
		const items = fs.readdirSync(dir);

		for (const item of items) {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				scanDirectory(fullPath, [...currentPath, item]);
			} else if (item.endsWith(".md")) {
				const fileName = item.replace(/\.md$/, "");
				allPaths.push([...currentPath, fileName]);
			}
		}
	}

	scanDirectory(docsDirectory);

	return allPaths.map(path => ({
		slug: path,
	}));
}
