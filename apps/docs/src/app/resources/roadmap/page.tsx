import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Roadmap() {
	const docData = getDocData("resources/roadmap");

	return <MarkdownContent content={docData.contentHtml} />;
}
