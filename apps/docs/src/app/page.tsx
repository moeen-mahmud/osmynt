import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Home() {
	const docData = getDocData("index");

	return <MarkdownContent content={docData.contentHtml} />;
}
