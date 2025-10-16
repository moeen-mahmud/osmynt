import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Configuration() {
	const docData = getDocData("reference/configuration");

	return <MarkdownContent content={docData.contentHtml} />;
}
