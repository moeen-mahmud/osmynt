import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Features() {
	const docData = getDocData("features/index");

	return <MarkdownContent content={docData.contentHtml} />;
}
