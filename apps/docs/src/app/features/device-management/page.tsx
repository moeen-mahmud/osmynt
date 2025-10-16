import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function DeviceManagement() {
	const docData = getDocData("features/device-management");

	return <MarkdownContent content={docData.contentHtml} />;
}
