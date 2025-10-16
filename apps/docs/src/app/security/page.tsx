import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Security() {
	const docData = getDocData("security/index");

	return <MarkdownContent content={docData.contentHtml} />;
}
