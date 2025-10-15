import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Commands() {
	const docData = getDocData("reference/commands");

	return <MarkdownContent content={docData.contentHtml} />;
}
