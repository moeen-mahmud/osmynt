import * as vscode from "vscode";
import type { OsmyntCodeSnippet } from "./osmynt-data.provider";

interface ScoredSnippet {
	score: number;
	snippet: OsmyntCodeSnippet;
	matchedText: string;
	indentation: string;
}

interface InsertedSnippet {
	snippet: OsmyntCodeSnippet;
	range: vscode.Range;
	timestamp: number;
}

export class SnippetTracker {
	private static instance: SnippetTracker;
	private insertedSnippets: Map<string, InsertedSnippet[]> = new Map();

	private constructor() {}

	public static getInstance(): SnippetTracker {
		if (!SnippetTracker.instance) {
			SnippetTracker.instance = new SnippetTracker();
		}
		return SnippetTracker.instance;
	}

	public trackSnippet(document: vscode.TextDocument, snippet: OsmyntCodeSnippet, range: vscode.Range) {
		const docKey = document.uri.toString();
		const snippets = this.insertedSnippets.get(docKey) || [];

		// Add new snippet
		snippets.push({
			snippet,
			range,
			timestamp: Date.now(),
		});

		this.insertedSnippets.set(docKey, snippets);

		// Trigger CodeLens refresh
		vscode.commands.executeCommand("editor.action.triggerParameterHints");
	}

	public getSnippetsForDocument(document: vscode.TextDocument): InsertedSnippet[] {
		return this.insertedSnippets.get(document.uri.toString()) || [];
	}

	public clearSnippetsForDocument(document: vscode.TextDocument) {
		this.insertedSnippets.delete(document.uri.toString());
	}
}

export class OsmyntLensProvider implements vscode.CodeLensProvider {
	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

	constructor(private snippetTracker: SnippetTracker) {
		// Refresh CodeLenses when the editor changes
		vscode.window.onDidChangeActiveTextEditor(() => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public async provideCodeLenses(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Promise<vscode.CodeLens[]> {
		const codeLenses: vscode.CodeLens[] = [];
		const insertedSnippets = this.snippetTracker.getSnippetsForDocument(document);

		for (const { snippet, range, timestamp } of insertedSnippets) {
			const timeDiff = this.getTimeDifference(timestamp);

			// Create CodeLens for snippet info
			codeLenses.push(
				new vscode.CodeLens(range, {
					title: `🤖 Shared by ${snippet.sendBy.username} (${timeDiff})`,
					command: "osmynt.showSnippetDetails",
					arguments: [snippet],
				})
			);

			// Create CodeLens for file info
			codeLenses.push(
				new vscode.CodeLens(range, {
					title: `📄 From ${snippet.editorData.fileName}`,
					command: "osmynt.openOriginalFile",
					arguments: [snippet],
				})
			);
		}

		return codeLenses;
	}

	private getTimeDifference(timestamp: number): string {
		const now = Date.now();
		const diff = now - timestamp;

		if (diff < 60000) return "just now";
		if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
		if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
		return `${Math.floor(diff / 86400000)}d ago`;
	}
}

export class GhostTextCompletionProvider implements vscode.InlineCompletionItemProvider {
	private snippets: OsmyntCodeSnippet[] = [];
	private snippetUsage: Map<string, number> = new Map();
	private snippetTracker: SnippetTracker;

	constructor() {
		this.snippetTracker = SnippetTracker.getInstance();
	}

	public updateSnippets(newSnippets: OsmyntCodeSnippet[]) {
		this.snippets = newSnippets;
	}

	private incrementUsage(snippetId: string) {
		const current = this.snippetUsage.get(snippetId) || 0;
		this.snippetUsage.set(snippetId, current + 1);
	}

	private getIndentation(line: string): string {
		const match = line.match(/^[\s\t]*/);
		return match ? match[0] : "";
	}

	private normalizeIndentation(text: string, baseIndentation: string): string {
		const lines = text?.split("\n");
		if (lines.length <= 1) return text;

		// Find minimum indentation in the snippet
		const indentations = lines
			.filter(line => line.trim().length > 0)
			.map(line => line.match(/^[\s\t]*/)?.[0].length || 0);
		const minIndent = Math.min(...indentations);

		// Normalize each line's indentation
		return lines
			.map((line, index) => {
				if (index === 0) return line; // Keep first line as is
				if (line.trim().length === 0) return ""; // Empty lines
				// Remove original indentation and add new indentation
				return baseIndentation + line.slice(minIndent);
			})
			.join("\n");
	}

	private calculateContextScore(documentText: string, position: vscode.Position, snippet: OsmyntCodeSnippet): number {
		const documentLines = documentText?.split("\n");
		const currentLine = position.line;
		const contextWindow = 5; // Look at 5 lines before the current position

		let score = 0;
		const contextLines = documentLines.slice(Math.max(0, currentLine - contextWindow), currentLine).join("\n");

		// Check for similar variable names
		const varNameRegex = /\b[a-zA-Z_]\w*\b/g;
		const contextVars = new Set([...contextLines.matchAll(varNameRegex)].map(m => m[0]));
		const snippetVars = new Set([...snippet.code.matchAll(varNameRegex)].map(m => m[0]));

		// Calculate intersection of variable names
		const commonVars = new Set([...contextVars].filter(x => snippetVars.has(x)));
		score += commonVars.size * 0.1;

		// Check for similar syntax patterns
		if (contextLines.includes("{") && snippet.code.includes("{")) score += 0.1;
		if (contextLines.includes("(") && snippet.code.includes("(")) score += 0.1;

		// Language matching
		const languageBonus = documentText.toLowerCase().includes(snippet.editorData.languageId.toLowerCase())
			? 0.2
			: 0;
		score += languageBonus;

		// Usage frequency bonus
		const usageBonus = (this.snippetUsage.get(snippet.sendBy._id) || 0) * 0.05;
		score += Math.min(usageBonus, 0.3); // Cap at 0.3

		return Math.min(score, 1); // Normalize to max 1.0
	}

	private findMatchingSnippets(document: vscode.TextDocument, position: vscode.Position): ScoredSnippet[] {
		const lineText = document.lineAt(position).text;
		const linePrefix = lineText.substring(0, position.character);
		const indentation = this.getIndentation(lineText);

		if (linePrefix.trim().length < 2) return [];

		const scoredSnippets: ScoredSnippet[] = [];

		for (const snippet of this.snippets) {
			// Skip if the snippet is too long (prevent overwhelming completions)
			if (snippet.code?.split("\n").length > 50) continue;

			const contextScore = this.calculateContextScore(document.getText(), position, snippet);

			// Check if the snippet start matches the current line
			const snippetLines = snippet.code?.split("\n");
			const firstLine = snippetLines[0].trim();

			if (linePrefix.trim() && firstLine.startsWith(linePrefix.trim())) {
				const normalizedText = this.normalizeIndentation(snippet.code, indentation);

				scoredSnippets.push({
					score: contextScore,
					snippet,
					matchedText: normalizedText,
					indentation,
				});
			}
		}

		return scoredSnippets.sort((a, b) => b.score - a.score).slice(0, 3); // Limit to top 3 suggestions
	}

	public async provideInlineCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		context: vscode.InlineCompletionContext,
		token: vscode.CancellationToken
	): Promise<vscode.InlineCompletionItem[]> {
		const matchingSnippets = this.findMatchingSnippets(document, position);

		return matchingSnippets.map(({ snippet, matchedText, indentation }) => {
			const lineText = document.lineAt(position).text;
			const linePrefix = lineText.substring(0, position.character);

			const snippetLines = matchedText?.split("\n");
			const firstLine = snippetLines[0];
			const remainingLines = snippetLines.slice(1);

			const typedText = linePrefix.trim();
			const firstLineWithoutPrefix = firstLine.substring(typedText.length);

			const completionText = [firstLineWithoutPrefix, ...remainingLines].join("\n");

			const range = new vscode.Range(position, position.with({ character: lineText.length }));

			const item = new vscode.InlineCompletionItem(completionText, range);

			// Track the snippet when it's accepted
			item.command = {
				command: "osmynt.trackInsertedSnippet",
				title: "Track Snippet",
				arguments: [document, snippet, range],
			};

			return item;
		});
	}
}

export function registerSnippetProviders(context: vscode.ExtensionContext) {
	const snippetTracker = SnippetTracker.getInstance();
	const ghostTextProvider = new GhostTextCompletionProvider();
	const codeLensProvider = new OsmyntLensProvider(snippetTracker);

	// Register the CodeLens provider
	context.subscriptions.push(vscode.languages.registerCodeLensProvider({ pattern: "**" }, codeLensProvider));

	// Register the ghost text provider
	context.subscriptions.push(
		vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, ghostTextProvider)
	);

	// Register command to track inserted snippets
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"osmynt.trackInsertedSnippet",
			(document: vscode.TextDocument, snippet: OsmyntCodeSnippet, range: vscode.Range) => {
				if (!snippet) {
					vscode.window.showWarningMessage("No snippet is selected to track");
					return;
				}

				snippetTracker.trackSnippet(document, snippet, range);
			}
		)
	);

	// Register command to show snippet details
	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.showSnippetDetails", (snippet: OsmyntCodeSnippet) => {
			if (!snippet) {
				vscode.window.showWarningMessage("No snippet is selected");
				return;
			}

			vscode.window.showInformationMessage(
				`Snippet shared by ${snippet.sendBy.username} from ${snippet.editorData.fileName}`
			);
		})
	);

	// Register command to open original file
	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.openOriginalFile", (snippet: OsmyntCodeSnippet) => {
			if (!snippet) {
				vscode.window.showWarningMessage("No snippet is selected to open");
				return;
			}
			vscode.workspace
				.openTextDocument(snippet.editorData.fileName)
				.then(doc => vscode.window.showTextDocument(doc));
		})
	);

	return {
		ghostTextProvider,
		codeLensProvider,
		snippetTracker,
	};
}
