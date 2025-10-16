import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function BrandGuidelines() {
	const docData = getDocData("resources/brand-guidelines");

	return <MarkdownContent content={docData.contentHtml} />;
}
