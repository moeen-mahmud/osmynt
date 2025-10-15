import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function DeviceProblems() {
	const docData = getDocData("troubleshooting/device-problems");

	return <MarkdownContent content={docData.contentHtml} />;
}
