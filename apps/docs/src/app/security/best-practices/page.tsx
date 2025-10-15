import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function BestPractices() {
	const docData = getDocData("security/best-practices");

	return <MarkdownContent content={docData.contentHtml} />;
}
