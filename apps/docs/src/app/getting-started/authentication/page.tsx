import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Authentication() {
	const docData = getDocData("getting-started/authentication");

	return <MarkdownContent content={docData.contentHtml} />;
}
