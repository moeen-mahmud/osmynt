import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function CodeSharing() {
	const docData = getDocData("features/code-sharing");

	return <MarkdownContent content={docData.contentHtml} />;
}
