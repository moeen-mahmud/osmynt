import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Resources() {
	const docData = getDocData("resources/index");

	return <MarkdownContent content={docData.contentHtml} />;
}
