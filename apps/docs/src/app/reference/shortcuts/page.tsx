import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Shortcuts() {
	const docData = getDocData("reference/shortcuts");

	return <MarkdownContent content={docData.contentHtml} />;
}
