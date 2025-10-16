import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Support() {
	const docData = getDocData("resources/support");

	return <MarkdownContent content={docData.contentHtml} />;
}
