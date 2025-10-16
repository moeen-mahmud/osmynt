import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Reference() {
	const docData = getDocData("reference/index");

	return <MarkdownContent content={docData.contentHtml} />;
}
