"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
	Play,
	Pause,
	RotateCcw,
	Users,
	GitBranch,
	Eye,
	AlertCircle,
	CheckCircle,
	Send,
	UserPlus,
	LogIn,
	Github,
	Share2,
} from "lucide-react";
import Editor from "@monaco-editor/react";

interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	isLoggedIn: boolean;
	teamId?: string;
}

interface CodeBlock {
	id: string;
	title: string;
	content: string;
	language: string;
	author: string;
	createdAt: string;
	filePath?: string;
	startLine?: number;
	endLine?: number;
}

interface TeamMember {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: "OWNER" | "MEMBER";
	status: "online" | "offline" | "away";
}

export function InteractiveDemo() {
	// User state
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const [showInviteDialog, setShowInviteDialog] = useState(false);

	// Team state
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [bobUser, setBobUser] = useState<User>({
		id: "bob-1",
		name: "Bob",
		email: "bob@example.com",
		avatar: "B",
		isLoggedIn: false,
	});

	// Editor state
	const [userCode, setUserCode] = useState(`// User authentication service
const authenticateUser = async (credentials) => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    throw new Error('Authentication failed');
  }
  
  return await response.json();
};

const validateToken = (token) => {
  // Token validation logic
  return jwt.verify(token, process.env.JWT_SECRET);
};`);

	const [bobCode, setBobCode] = useState(`// User management service
class UserService {
  constructor() {
    this.users = new Map();
  }
  
  async createUser(userData) {
    // Create user logic
    const user = { id: Date.now(), ...userData };
    this.users.set(user.id, user);
    return user;
  }
  
  async updateUser(userId, updates) {
    // Update user logic
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    Object.assign(user, updates);
    return user;
  }
}`);

	// Demo state
	const [selectedLines, setSelectedLines] = useState<{ start: number; end: number } | null>(null);
	const [sharedCodeBlocks, setSharedCodeBlocks] = useState<CodeBlock[]>([]);
	const [showCodeBlocks, setShowCodeBlocks] = useState(false);
	const [isBobTyping, setIsBobTyping] = useState(false);
	const [notifications, setNotifications] = useState<string[]>([]);
	const [isAutoPlaying, setIsAutoPlaying] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Guided experience state
	const [currentGuideStep, setCurrentGuideStep] = useState(0);
	const [showGuide, setShowGuide] = useState(true);
	const [isEditorReady, setIsEditorReady] = useState(false);

	const userEditorRef = useRef<any>(null);
	const bobEditorRef = useRef<any>(null);

	// Guided steps
	const guideSteps = [
		{
			title: "Welcome to Osmynt!",
			description: "Let's walk through how Osmynt works. First, you'll need to log in.",
			action: "Click the 'Login' button to get started",
			highlight: "login-button",
		},
		{
			title: "Enter Your Details",
			description: "Enter your name and email to simulate logging into Osmynt.",
			action: "Fill in your details and click 'Login'",
			highlight: "login-form",
		},
		{
			title: "Invite Bob to Your Team",
			description: "Now let's invite Bob to join your team so you can share code with him.",
			action: "Click 'Invite Bob' to send an invitation",
			highlight: "invite-button",
		},
		{
			title: "Select Code to Share",
			description: "Great! Bob has joined your team. Now select some code in your editor to share with him.",
			action: "Click and drag to select lines 1-18 in your editor",
			highlight: "user-editor",
		},
		{
			title: "Share Your Code",
			description: "Perfect! You've selected the authentication code. Now share it with Bob.",
			action: "Click 'Share Code' to send it to Bob",
			highlight: "share-button",
		},
		{
			title: "Bob Receives Your Code",
			description: "Bob has received your code! You can see it in the 'Code Blocks' panel.",
			action: "Click 'Code Blocks' to view shared code",
			highlight: "code-blocks-button",
		},
		{
			title: "Apply Changes",
			description: "Bob can now apply your shared code to his editor using Git-like diff application.",
			action: "Click 'Apply Diff' to see the changes applied",
			highlight: "apply-diff-button",
		},
		{
			title: "Success!",
			description:
				"Amazing! You've successfully shared code with Bob. This is how Osmynt enables secure, real-time code collaboration.",
			action: "Try the 'Auto Play' button to see the full workflow",
			highlight: "auto-play-button",
		},
	];

	// Auto-play steps
	const autoPlaySteps = [
		{ action: "login", delay: 2000 },
		{ action: "invite", delay: 3000 },
		{ action: "bob_accept", delay: 2000 },
		{ action: "share_code", delay: 3000 },
		{ action: "bob_receive", delay: 2000 },
		{ action: "apply_diff", delay: 3000 },
	];

	const addNotification = (message: string) => {
		setNotifications(prev => [...prev, message]);
		setTimeout(() => {
			setNotifications(prev => prev.slice(1));
		}, 3000);
	};

	const handleLogin = () => {
		if (!userName || !userEmail) return;

		setIsLoggedIn(true);
		setShowLoginDialog(false);
		addNotification(`Welcome ${userName}! You're now logged in.`);

		// Advance guide step
		if (currentGuideStep === 1) {
			setCurrentGuideStep(2);
		}

		// Auto-invite Bob after login
		setTimeout(() => {
			handleInviteBob();
		}, 2000);
	};

	const handleInviteBob = () => {
		setShowInviteDialog(false);
		addNotification("Invitation sent to Bob!");

		// Advance guide step
		if (currentGuideStep === 2) {
			setCurrentGuideStep(3);
		}

		// Bob accepts invitation after 2 seconds
		setTimeout(() => {
			setBobUser(prev => ({ ...prev, isLoggedIn: true, teamId: "team-1" }));
			setTeamMembers([
				{
					id: "bob-1",
					name: "Bob",
					email: "bob@example.com",
					avatar: "B",
					role: "MEMBER",
					status: "online",
				},
			]);
			addNotification("Bob joined your team!");
		}, 2000);
	};

	const handleShareCode = () => {
		if (!selectedLines) return;

		const selectedCode = userCode
			.split("\n")
			.slice(selectedLines.start - 1, selectedLines.end)
			.join("\n");
		const newCodeBlock: CodeBlock = {
			id: `block-${Date.now()}`,
			title: "Authentication Service",
			content: selectedCode,
			language: "javascript",
			author: userName || "You",
			createdAt: new Date().toISOString(),
			filePath: "auth.js",
			startLine: selectedLines.start,
			endLine: selectedLines.end,
		};

		setSharedCodeBlocks(prev => [...prev, newCodeBlock]);
		addNotification("Code shared with team!");

		// Advance guide step
		if (currentGuideStep === 4) {
			setCurrentGuideStep(5);
		}

		// Bob receives the code
		setTimeout(() => {
			setIsBobTyping(true);
			addNotification("Bob is reviewing your code...");

			setTimeout(() => {
				setIsBobTyping(false);
				setShowCodeBlocks(true);
				addNotification("Bob received your code!");
			}, 2000);
		}, 1500);
	};

	const handleApplyDiff = (codeBlock: CodeBlock) => {
		addNotification("Applying changes to Bob's file...");

		// Simulate applying the diff
		setTimeout(() => {
			const newCode = bobCode + "\n\n" + codeBlock.content;
			setBobCode(newCode);
			addNotification("Changes applied successfully!");
		}, 2000);
	};

	const startAutoPlay = () => {
		setIsAutoPlaying(true);

		const executeStep = (stepIndex: number) => {
			if (stepIndex >= autoPlaySteps.length) {
				setIsAutoPlaying(false);
				return;
			}

			const step = autoPlaySteps[stepIndex];

			switch (step.action) {
				case "login":
					setUserName("Alice");
					setUserEmail("alice@example.com");
					handleLogin();
					break;
				case "invite":
					handleInviteBob();
					break;
				case "bob_accept":
					// Already handled in invite
					break;
				case "share_code":
					setSelectedLines({ start: 1, end: 18 });
					handleShareCode();
					break;
				case "bob_receive":
					// Already handled in share_code
					break;
				case "apply_diff":
					if (sharedCodeBlocks.length > 0) {
						handleApplyDiff(sharedCodeBlocks[0]);
					}
					break;
			}

			setTimeout(() => executeStep(stepIndex + 1), step.delay);
		};

		executeStep(0);
	};

	const stopAutoPlay = () => {
		setIsAutoPlaying(false);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const resetDemo = () => {
		setUserName("");
		setUserEmail("");
		setIsLoggedIn(false);
		setTeamMembers([]);
		setBobUser(prev => ({ ...prev, isLoggedIn: false, teamId: undefined }));
		setSharedCodeBlocks([]);
		setShowCodeBlocks(false);
		setSelectedLines(null);
		setNotifications([]);
		setIsAutoPlaying(false);
	};

	const EditorPanel = ({
		title,
		user,
		code,
		setCode,
		onSelectionChange,
		isReadOnly = false,
		showActions = true,
	}: {
		title: string;
		user: User;
		code: string;
		setCode: (code: string) => void;
		onSelectionChange?: (selection: { start: number; end: number } | null) => void;
		isReadOnly?: boolean;
		showActions?: boolean;
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
							>
								<Eye className="h-3 w-3" />
								Code Blocks
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

			<div className="h-80 border-b border-border">
				<Editor
					height="100%"
					language="javascript"
					value={code}
					onChange={value => setCode(value || "")}
					onMount={editor => {
						editor.onDidChangeCursorSelection(e => {
							if (onSelectionChange) {
								const selection = e.selection;
								if (
									selection.startLineNumber !== selection.endLineNumber ||
									selection.startColumn !== selection.endColumn
								) {
									onSelectionChange({
										start: selection.startLineNumber,
										end: selection.endLineNumber,
									});
								} else {
									onSelectionChange(null);
								}
							}
						});
					}}
					options={{
						readOnly: isReadOnly,
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						fontSize: 14,
						lineNumbers: "on",
						wordWrap: "on",
						automaticLayout: true,
					}}
					theme="vs-dark"
				/>
			</div>

			{showActions && user.id !== "bob-1" && selectedLines && (
				<div className="p-3 bg-muted/30 border-b border-border">
					<div className="flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							Selected lines {selectedLines.start}-{selectedLines.end}
						</div>
						<Button size="sm" onClick={handleShareCode} className="gap-1">
							<Share2 className="h-3 w-3" />
							Share Code
						</Button>
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div className="relative rounded-lg border border-border bg-card p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="flex gap-1.5">
						<div className="h-3 w-3 rounded-full bg-red-500/80"></div>
						<div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
						<div className="h-3 w-3 rounded-full bg-green-500/80"></div>
					</div>
					<span className="text-sm text-muted-foreground font-mono">Osmynt Interactive Demo</span>
				</div>

				<div className="flex items-center gap-2">
					{!isLoggedIn ? (
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setShowLoginDialog(true)}
							className="gap-2"
						>
							<LogIn className="h-4 w-4" />
							Login
						</Button>
					) : (
						<>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setShowInviteDialog(true)}
								className="gap-2"
							>
								<UserPlus className="h-4 w-4" />
								Invite Bob
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={isAutoPlaying ? stopAutoPlay : startAutoPlay}
								className="gap-2"
							>
								{isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
								{isAutoPlaying ? "Stop" : "Auto Play"}
							</Button>
							<Button variant="outline" size="sm" onClick={resetDemo} className="gap-2">
								<RotateCcw className="h-4 w-4" />
								Reset
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Team Status */}
			{teamMembers.length > 0 && (
				<div className="mb-6 p-4 bg-muted/30 rounded-lg">
					<div className="flex items-center gap-2 mb-3">
						<Users className="h-4 w-4 text-primary" />
						<span className="font-medium">Team Members</span>
					</div>
					<div className="flex gap-3">
						{teamMembers.map(member => (
							<div key={member.id} className="flex items-center gap-2">
								<div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
									{member.avatar}
								</div>
								<span className="text-sm">{member.name}</span>
								<Badge variant="outline" className="text-xs">
									{member.role}
								</Badge>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Dual Editor Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* User's Editor */}
				<EditorPanel
					title="Your Editor"
					user={{
						id: "user-1",
						name: userName || "You",
						email: userEmail,
						avatar: userName ? userName[0].toUpperCase() : "U",
						isLoggedIn,
					}}
					code={userCode}
					setCode={setUserCode}
					onSelectionChange={setSelectedLines}
					showActions={isLoggedIn}
				/>

				{/* Bob's Editor */}
				<EditorPanel
					title="Bob's Editor"
					user={bobUser}
					code={bobCode}
					setCode={setBobCode}
					isReadOnly={true}
					showActions={bobUser.isLoggedIn}
				/>
			</div>

			{/* Code Blocks Panel */}
			{showCodeBlocks && sharedCodeBlocks.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-6 p-4 bg-muted/30 rounded-lg"
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
											by {block.author} • {block.filePath} • Lines {block.startLine}-
											{block.endLine}
										</div>
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleApplyDiff(block)}
											className="gap-1"
										>
											<GitBranch className="h-3 w-3" />
											Apply Diff
										</Button>
										<Button size="sm" variant="outline" className="gap-1">
											<Eye className="h-3 w-3" />
											View
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
			)}

			{/* Notifications */}
			<AnimatePresence>
				{notifications.map((notification, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: 100, y: -100 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						exit={{ opacity: 0, x: 100, y: -100 }}
						className="fixed top-4 right-4 bg-primary text-primary-foreground rounded-lg p-3 shadow-lg z-50 max-w-sm"
					>
						<div className="flex items-center gap-2">
							<AlertCircle className="h-4 w-4" />
							<span className="text-sm font-medium">{notification}</span>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{/* Login Dialog */}
			<Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Github className="h-5 w-5" />
							Mock GitHub Login
						</DialogTitle>
						<DialogDescription>Enter your details to simulate logging into Osmynt</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label htmlFor="user-name" className="text-sm font-medium">
								Name
							</label>
							<Input
								id="user-name"
								value={userName}
								onChange={e => setUserName(e.target.value)}
								placeholder="Enter your name"
								className="mt-1"
							/>
						</div>
						<div>
							<label htmlFor="user-email" className="text-sm font-medium">
								Email
							</label>
							<Input
								id="user-email"
								value={userEmail}
								onChange={e => setUserEmail(e.target.value)}
								placeholder="Enter your email"
								className="mt-1"
							/>
						</div>
						<Button onClick={handleLogin} className="w-full gap-2">
							<LogIn className="h-4 w-4" />
							Login
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Invite Dialog */}
			<Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite Bob to Your Team</DialogTitle>
						<DialogDescription>Send an invitation to Bob to join your team</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="p-4 bg-muted/30 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
									B
								</div>
								<div>
									<div className="font-medium">Bob</div>
									<div className="text-sm text-muted-foreground">bob@example.com</div>
								</div>
							</div>
						</div>
						<Button onClick={handleInviteBob} className="w-full gap-2">
							<Send className="h-4 w-4" />
							Send Invitation
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
