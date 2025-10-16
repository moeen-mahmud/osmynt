import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function GettingStarted() {
	const docData = getDocData("getting-started/index");

	return <MarkdownContent content={docData.contentHtml} />;
}
