import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Troubleshooting() {
	const docData = getDocData("troubleshooting/index");

	return <MarkdownContent content={docData.contentHtml} />;
}
