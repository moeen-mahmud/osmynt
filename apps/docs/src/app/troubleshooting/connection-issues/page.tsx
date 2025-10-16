import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function ConnectionIssues() {
	const docData = getDocData("troubleshooting/connection-issues");

	return <MarkdownContent content={docData.contentHtml} />;
}
