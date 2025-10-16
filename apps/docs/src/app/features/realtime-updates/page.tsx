import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function RealtimeUpdates() {
	const docData = getDocData("features/realtime-updates");

	return <MarkdownContent content={docData.contentHtml} />;
}
