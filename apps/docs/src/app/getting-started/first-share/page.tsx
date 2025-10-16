import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function FirstShare() {
	const docData = getDocData("getting-started/first-share");

	return <MarkdownContent content={docData.contentHtml} />;
}
