import * as vscode from "vscode";
import type { OsmyntCodeSnippet } from "./osmynt-data.provider";

export class OsmyntCompletionProvider implements vscode.CompletionItemProvider {
	private snippets: OsmyntCodeSnippet[] = [];

	constructor() {
		this.snippets = [];
	}

	public updateSnippets(newSnippets: OsmyntCodeSnippet[]) {
		this.snippets = newSnippets;
	}

	public addSnippet(snippet: OsmyntCodeSnippet) {
		this.snippets.push(snippet);
	}

	async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position
	): Promise<vscode.CompletionItem[]> {
		const completionItems: vscode.CompletionItem[] = [];

		// Fetch the current line text and cursor context
		// const lineText = document.lineAt(position).text;
		// const linePrefix = lineText.substr(0, position.character);

		// Iterate over snippets for suggestions
		for (const snippet of this.snippets) {
			const lines = snippet.code?.split("\n");

			// Example of multiline completion prediction
			let multilineSuggestion = "";
			for (const line of lines) {
				if (!line) continue;
				// biome-ignore lint/style/useTemplate: <explanation>
				multilineSuggestion += `${line}` + "\n";
			}

			// Create completion items with multiline insertion
			const item = new vscode.CompletionItem(multilineSuggestion);
			item.kind = vscode.CompletionItemKind.Text; // Change to a type like "Copilot-style"
			item.detail = `Suggestion from ${snippet.sendBy.username}: ${snippet.editorData.fileName}`;
			// item.documentation = new vscode.MarkdownString(`Suggested code:\n\n${snippet.code}`);
			item.insertText = new vscode.SnippetString(multilineSuggestion); // Multiline insertion

			// Inline completion logic for smoother interaction
			// if (linePrefix.endsWith(" ")) {
			// 	item.filterText = linePrefix + multilineSuggestion; // Context-sensitive filter
			// }

			completionItems.push(item);
		}

		return completionItems;
	}
}

// Export the registration function
export function registerCompletionProvider(context: vscode.ExtensionContext): OsmyntCompletionProvider {
	const provider = new OsmyntCompletionProvider();

	// Register for all languages with multiple selector types
	const disposables = [
		// Register for specific file types
		vscode.languages.registerCompletionItemProvider(
			{
				pattern: "**",
			},
			provider,
			".",
			" "
		),

		// Register for all other file types
		vscode.languages.registerCompletionItemProvider({ pattern: "**" }, provider, ".", " "),
	];

	context.subscriptions.push(...disposables);
	return provider;
}
