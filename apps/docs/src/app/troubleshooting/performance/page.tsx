import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Performance() {
	const docData = getDocData("troubleshooting/performance");

	return <MarkdownContent content={docData.contentHtml} />;
}
