import { getDocData } from "@/lib/markdown";
import { MarkdownContent } from "@/components/markdown-content";

export default function Encryption() {
	const docData = getDocData("security/encryption");

	return <MarkdownContent content={docData.contentHtml} />;
}
