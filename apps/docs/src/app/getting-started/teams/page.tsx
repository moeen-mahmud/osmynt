import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Teams() {
	const docData = getDocData("getting-started/teams");

	return <MarkdownContent content={docData.contentHtml} />;
}
