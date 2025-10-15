import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function CommonIssues() {
	const docData = getDocData("troubleshooting/common-issues");

	return <MarkdownContent content={docData.contentHtml} />;
}
