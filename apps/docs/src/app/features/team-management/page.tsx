import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function TeamManagement() {
	const docData = getDocData("features/team-management");

	return <MarkdownContent content={docData.contentHtml} />;
}
