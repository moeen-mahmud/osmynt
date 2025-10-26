import type { CodeBlock, User } from "@/components/demo/demo.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, Share2 } from "lucide-react";
import StableMonacoEditor from "@/components/demo/demo-editor";
import { demoEditorOptions } from "@/components/demo/demo.config";
import { motion } from "framer-motion";
import { memo } from "react";

type DemoEditorPanelProps = {
	title: string;
	user: User;
	code: string;
	setCode: (code: string) => void;
	selectedLines: { start: number; end: number } | null;
	handleShareCode: () => void;
	showCodeBlocks: boolean;
	setShowCodeBlocks: (show: boolean) => void;
	sharedCodeBlocks: CodeBlock[];
	isBobTyping: boolean;
	showActions?: boolean;
	onMount?: (editor: any) => void;
};
const DemoEditorPanel: React.FC<DemoEditorPanelProps> = ({
	title,
	user,
	code,
	setCode,
	selectedLines,
	handleShareCode,
	showCodeBlocks,
	setShowCodeBlocks,
	sharedCodeBlocks,
	isBobTyping,
	showActions = true,
	onMount,
}) => (
	<div className="flex-1 min-h-[400px]">
		<div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
			<div className="flex items-center gap-3">
				<div
					className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
						user.id === "bob-1" ? "bg-green-500" : "bg-blue-500"
					}`}
				>
					{user.avatar}
				</div>
				<div>
					<div className="font-medium">{user.name}</div>
					<div className="text-sm text-muted-foreground">{title}</div>
				</div>
				{user.isLoggedIn && (
					<Badge variant="secondary" className="text-xs">
						<CheckCircle className="h-3 w-3 mr-1" />
						Online
					</Badge>
				)}
			</div>
			{showActions && (
				<div className="flex items-center gap-2">
					{user.id !== "bob-1" && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setShowCodeBlocks(!showCodeBlocks)}
							className="gap-1"
							id="code-blocks-button"
						>
							<Eye className="h-3 w-3" />
							Code Blocks
							{sharedCodeBlocks.length > 0 && (
								<Badge variant="secondary" className="ml-1 text-xs">
									{sharedCodeBlocks.length}
								</Badge>
							)}
						</Button>
					)}
					{user.id === "bob-1" && isBobTyping && (
						<div className="flex items-center gap-1 text-sm text-muted-foreground">
							<div className="animate-pulse">●</div>
							Typing...
						</div>
					)}
				</div>
			)}
		</div>

		<div className="h-[50vh] border-b border-border">
			<StableMonacoEditor
				height="100%"
				language="javascript"
				value={code}
				onChange={value => setCode(value as string)}
				onMount={onMount}
				theme="vs-dark"
				options={demoEditorOptions}
				loading={
					<div className="flex items-center justify-center h-full text-muted-foreground">
						Loading editor...
					</div>
				}
				keepCurrentModel={true}
			/>
		</div>

		{showActions && user.id !== "bob-1" && selectedLines && (
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="p-3 bg-primary/5 border border-primary/20"
				id="share-button"
			>
				<div className="flex items-center justify-between">
					<div className="text-sm text-primary font-medium">
						✓ Selected lines {selectedLines.start}-{selectedLines.end}
					</div>
					<Button size="sm" onClick={handleShareCode} className="gap-1 bg-primary hover:bg-primary/90">
						<Share2 className="h-3 w-3" />
						Share Code
					</Button>
				</div>
			</motion.div>
		)}
	</div>
);

// stable version
export const StableDemoEditorPanel = memo(DemoEditorPanel);
