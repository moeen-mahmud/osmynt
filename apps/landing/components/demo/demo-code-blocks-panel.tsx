import type { CodeBlock } from "@/components/demo/demo.types";
import { motion } from "framer-motion";
import { Eye, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

type DemoCodeBlocksPanelProps = {
	sharedCodeBlocks: CodeBlock[];
	handleApplyDiff: (block: CodeBlock) => void;
};

export const DemoCodeBlocksPanel: React.FC<DemoCodeBlocksPanelProps> = ({ sharedCodeBlocks, handleApplyDiff }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mt-6 p-4 bg-muted/30 rounded-lg"
			id="code-blocks-panel"
		>
			<div className="flex items-center gap-2 mb-4">
				<Eye className="h-4 w-4 text-primary" />
				<span className="font-medium">Shared Code Blocks</span>
			</div>
			<div className="grid gap-3">
				{sharedCodeBlocks.map(block => (
					<div key={block.id} className="p-3 bg-card rounded border border-primary/20">
						<div className="flex items-center justify-between mb-2">
							<div>
								<div className="font-medium text-sm">{block.title}</div>
								<div className="text-xs text-muted-foreground">
									by {block.author} • {block.filePath} • Lines {block.startLine}-{block.endLine}
								</div>
							</div>
							<div className="flex gap-2">
								<Button size="sm" variant="outline" className="gap-1">
									<Eye className="h-3 w-3" />
									Viewing Code
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleApplyDiff(block)}
									className="gap-1"
									id="apply-diff-button"
								>
									<GitBranch className="h-3 w-3" />
									Apply Diff
								</Button>
							</div>
						</div>
						<pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
							<code>{block.content}</code>
						</pre>
					</div>
				))}
			</div>
		</motion.div>
	);
};
