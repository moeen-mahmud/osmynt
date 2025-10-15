import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function DiffApplication() {
	const docData = getDocData("features/diff-application");

	return <MarkdownContent content={docData.contentHtml} />;
}
