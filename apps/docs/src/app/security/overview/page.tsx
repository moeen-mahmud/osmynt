import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function SecurityOverview() {
	const docData = getDocData("security/overview");

	return <MarkdownContent content={docData.contentHtml} />;
}
