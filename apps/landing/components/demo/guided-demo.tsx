"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Users, AlertCircle, UserPlus, LogIn, X, HelpCircle } from "lucide-react";
import type { User, TeamMember, CodeBlock } from "@/components/demo/demo.types";
import { guideSteps } from "@/components/demo/demo.data";
import { userCodeBlocks, bobCodeBlocks } from "@/components/demo/demo.config";
import { DemoPreview } from "@/components/demo/demo-preview";
import { StableDemoEditorPanel } from "@/components/demo/demo-editor-panel";
import { DemoGuide } from "@/components/demo/demo-guide";
import { DemoCodeBlocksPanel } from "@/components/demo/demo-code-blocks-panel";
import { DemoLogin } from "@/components/demo/demo-login";
import { DemoInvite } from "@/components/demo/demo-invite";

export function GuidedDemo() {
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
	const [userCode, setUserCode] = useState(userCodeBlocks);
	const [bobCode, setBobCode] = useState(bobCodeBlocks);

	// Demo state
	const [selectedLines, setSelectedLines] = useState<{ start: number; end: number } | null>(null);
	const [sharedCodeBlocks, setSharedCodeBlocks] = useState<CodeBlock[]>([]);
	const [showCodeBlocks, setShowCodeBlocks] = useState(false);
	const [isBobTyping, setIsBobTyping] = useState(false);
	const [notifications, setNotifications] = useState<string[]>([]);

	// Guided experience state
	const [currentGuideStep, setCurrentGuideStep] = useState(0);
	const [showGuide, setShowGuide] = useState(true);
	const [showDemo, setShowDemo] = useState(false);

	const userEditorRef = useRef<any>(null);
	const bobEditorRef = useRef<any>(null);

	const addNotification = useCallback((message: string) => {
		setNotifications(prev => [...prev, message]);
		setTimeout(() => {
			setNotifications(prev => prev.slice(1));
		}, 3000);
	}, []);

	const handleLogin = () => {
		if (!userName || !userEmail) return;

		setIsLoggedIn(true);
		setShowLoginDialog(false);
		addNotification(`Welcome ${userName}! You're now logged in.`);

		if (currentGuideStep === 1) {
			setCurrentGuideStep(2);
		}
	};

	const handleInviteBob = useCallback(() => {
		setShowInviteDialog(false);
		addNotification("Invitation sent to Bob!");

		if (currentGuideStep === 2) {
			setCurrentGuideStep(3);
		}

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
	}, [currentGuideStep, addNotification]);

	const handleShareCode = useCallback(() => {
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

		if (currentGuideStep === 4) {
			setCurrentGuideStep(5);
		}

		setTimeout(() => {
			setIsBobTyping(true);
			addNotification("Bob is reviewing your code...");

			setTimeout(() => {
				setIsBobTyping(false);
				setShowCodeBlocks(true);
				addNotification("Bob received your code!");
			}, 2000);
		}, 1500);
	}, [selectedLines, userCode, userName, currentGuideStep, addNotification]);

	const handleApplyDiff = useCallback(
		(codeBlock: CodeBlock) => {
			addNotification("Applying changes to Bob's file...");

			setTimeout(() => {
				const newCode = bobCode + "\n\n" + codeBlock.content;
				setBobCode(newCode);
				addNotification("Changes applied successfully!");

				if (currentGuideStep === 6) {
					setCurrentGuideStep(7);
				}
			}, 2000);
		},
		[bobCode, currentGuideStep, addNotification]
	);

	const nextGuideStep = () => {
		if (currentGuideStep < guideSteps.length - 1) {
			setCurrentGuideStep(currentGuideStep + 1);
		}
	};

	const prevGuideStep = () => {
		if (currentGuideStep > 0) {
			setCurrentGuideStep(currentGuideStep - 1);
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
		setCurrentGuideStep(0);
		setShowGuide(true);
	};

	const handleEditorMount = useCallback((editor: any) => {
		userEditorRef.current = editor;
		let selectionTimeout: NodeJS.Timeout;
		editor.onDidChangeCursorSelection((e: any) => {
			clearTimeout(selectionTimeout);
			selectionTimeout = setTimeout(() => {
				const selection = e.selection;
				if (
					selection.startLineNumber !== selection.endLineNumber ||
					selection.startColumn !== selection.endColumn
				) {
					setSelectedLines({
						start: selection.startLineNumber,
						end: selection.endLineNumber,
					});
				} else {
					setSelectedLines(null);
				}
			}, 1000);
		});
	}, []);

	const handleBobEditorMount = useCallback((editor: any) => {
		bobEditorRef.current = editor;
	}, []);

	const onChangeUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value);
	}, []);
	const onChangeUserEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUserEmail(e.target.value);
	}, []);

	if (!showDemo) {
		return <DemoPreview setShowDemo={setShowDemo} />;
	}

	return (
		<Dialog open={showDemo} modal>
			<DialogContent
				className="!max-w-[95vw] overflow-y-auto p-0 scrollbar-thumb-green-400 scrollbar-track-green-950 scrollbar-thin focus:outline-none h-full"
				showCloseButton={false}
			>
				<div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
					<div className="flex items-center gap-3">
						<div className="flex gap-1.5">
							<div className="h-3 w-3 rounded-full bg-red-500/80"></div>
							<div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
							<div className="h-3 w-3 rounded-full bg-green-500/80"></div>
						</div>
						<span className="text-sm text-muted-foreground font-mono">Osmynt Interactive Demo</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setShowDemo(false);
							resetDemo();
						}}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
				<div className="overflow-auto px-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							{!isLoggedIn ? (
								<Button
									variant="secondary"
									size="sm"
									onClick={() => setShowLoginDialog(true)}
									className="gap-2"
									id="login-button"
								>
									<LogIn className="h-4 w-4" />
									Login
								</Button>
							) : (
								<>
									{teamMembers.length === 0 && (
										<Button
											variant="secondary"
											size="sm"
											onClick={() => setShowInviteDialog(true)}
											className="gap-2"
											id="invite-button"
										>
											<UserPlus className="h-4 w-4" />
											Invite Bob
										</Button>
									)}
									<Button variant="outline" size="sm" onClick={resetDemo} className="gap-2">
										<RotateCcw className="h-4 w-4" />
										Reset
									</Button>
								</>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowGuide(!showGuide)}
								className="gap-2"
							>
								<HelpCircle className="h-4 w-4" />
								{showGuide ? "Hide Guide" : "Show Guide"}
							</Button>
						</div>
					</div>

					{showGuide && (
						<DemoGuide
							currentGuideStep={currentGuideStep}
							prevGuideStep={prevGuideStep}
							nextGuideStep={nextGuideStep}
							setShowGuide={setShowGuide}
						/>
					)}

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
						<div id="user-editor">
							<StableDemoEditorPanel
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
								onMount={handleEditorMount}
								showActions={isLoggedIn}
								selectedLines={selectedLines}
								handleShareCode={handleShareCode}
								showCodeBlocks={showCodeBlocks}
								setShowCodeBlocks={setShowCodeBlocks}
								sharedCodeBlocks={sharedCodeBlocks}
								isBobTyping={isBobTyping}
							/>
						</div>

						{/* Bob's Editor */}
						<StableDemoEditorPanel
							title="Bob's Editor"
							user={bobUser}
							code={bobCode}
							setCode={() => {}} // Bob's editor is read-only
							selectedLines={null}
							handleShareCode={() => {}}
							showCodeBlocks={false}
							setShowCodeBlocks={() => {}}
							sharedCodeBlocks={[]}
							isBobTyping={false}
							onMount={handleBobEditorMount}
							showActions={bobUser.isLoggedIn}
						/>
					</div>

					{/* Code Blocks Panel */}
					{showCodeBlocks && sharedCodeBlocks.length > 0 && (
						<DemoCodeBlocksPanel sharedCodeBlocks={sharedCodeBlocks} handleApplyDiff={handleApplyDiff} />
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
					<DemoLogin
						showLoginDialog={showLoginDialog}
						setShowLoginDialog={setShowLoginDialog}
						userName={userName}
						userEmail={userEmail}
						handleLogin={handleLogin}
						onChangeUserName={onChangeUserName}
						onChangeUserEmail={onChangeUserEmail}
					/>

					{/* Invite Dialog */}
					<DemoInvite
						showInviteDialog={showInviteDialog}
						setShowInviteDialog={setShowInviteDialog}
						handleInviteBob={handleInviteBob}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
