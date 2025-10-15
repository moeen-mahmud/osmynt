interface MarkdownContentProps {
	content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
	// biome-ignore lint/security/noDangerouslySetInnerHtml: FALSE POSITIVE
	return <div className="prose prose-lg max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: content }} />;
}
