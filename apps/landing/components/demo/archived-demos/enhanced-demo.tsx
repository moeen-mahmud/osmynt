"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	ChevronLeft,
	ChevronRight,
	Play,
	Pause,
	RotateCcw,
	SkipForward,
	SkipBack,
	GitBranch,
	Eye,
	Zap,
	Shield,
	AlertCircle,
} from "lucide-react";

interface EditorState {
	fileName: string;
	content: string;
	selectedLines?: number[];
	cursorPosition?: { line: number; column: number };
	hasChanges?: boolean;
}

interface DemoStep {
	id: number;
	title: string;
	description: string;
	aliceEditor: EditorState;
	bobEditor: EditorState;
	aliceAction?: string;
	bobAction?: string;
	showNotification?: boolean;
	showCodeBlocks?: boolean;
	showDiff?: boolean;
	showSharing?: boolean;
	duration?: number;
}

const demoSteps: DemoStep[] = [
	{
		id: 1,
		title: "Two developers working on a project",
		description: "Alice and Bob are working on the same codebase. Alice wants to share a code snippet with Bob.",
		aliceEditor: {
			fileName: "auth.js",
			content: `// User authentication service
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
};`,
			selectedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
			cursorPosition: { line: 1, column: 1 },
		},
		bobEditor: {
			fileName: "user-service.js",
			content: `// User management service
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
}`,
			cursorPosition: { line: 1, column: 1 },
		},
		aliceAction: "Alice selects code in her editor",
		bobAction: "Bob is working on another file",
		duration: 2000,
	},
	{
		id: 2,
		title: "Alice shares code with team",
		description: "Alice uses the Osmynt command to share the selected code with her team.",
		aliceEditor: {
			fileName: "auth.js",
			content: `// User authentication service
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
};`,
			selectedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
			hasChanges: true,
		},
		bobEditor: {
			fileName: "user-service.js",
			content: `// User management service
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
}`,
			cursorPosition: { line: 1, column: 1 },
		},
		aliceAction: "Alice: 'Osmynt: Share Selected Code'",
		bobAction: "Code is encrypted and sent to team",
		showSharing: true,
		duration: 2500,
	},
	{
		id: 3,
		title: "Bob receives the code",
		description: "Bob gets a notification and can view the shared code in his Osmynt panel.",
		aliceEditor: {
			fileName: "auth.js",
			content: `// User authentication service
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
};`,
			selectedLines: [],
		},
		bobEditor: {
			fileName: "user-service.js",
			content: `// User management service
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
}`,
			cursorPosition: { line: 1, column: 1 },
		},
		aliceAction: "Code shared successfully",
		bobAction: "Bob: 'Osmynt: View Code blocks'",
		showNotification: true,
		showCodeBlocks: true,
		duration: 2000,
	},
	{
		id: 4,
		title: "Bob reviews the code",
		description: "Bob can see the full context, file path, and line numbers of the shared code.",
		aliceEditor: {
			fileName: "auth.js",
			content: `// User authentication service
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
};`,
			selectedLines: [],
		},
		bobEditor: {
			fileName: "user-service.js",
			content: `// User management service
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
}`,
			cursorPosition: { line: 1, column: 1 },
		},
		aliceAction: "Code available in team channel",
		bobAction: "Bob examines the code snippet",
		showCodeBlocks: true,
		duration: 2500,
	},
	{
		id: 5,
		title: "Bob applies the changes",
		description: "Bob can apply the shared code directly to his file using Git-like diff application.",
		aliceEditor: {
			fileName: "auth.js",
			content: `// User authentication service
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
};`,
			selectedLines: [],
		},
		bobEditor: {
			fileName: "user-service.js",
			content: `// User management service
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
}`,
			cursorPosition: { line: 1, column: 1 },
		},
		aliceAction: "Code ready for application",
		bobAction: "Bob: 'Osmynt: Apply Diff'",
		showDiff: true,
		duration: 3000,
	},
	{
		id: 6,
		title: "Changes applied successfully",
		description: "Bob's file is updated with the shared code, maintaining his workflow and commit history.",
		aliceEditor: {
			fileName: "auth.js",
			content: `// User authentication service
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
};`,
			selectedLines: [],
		},
		bobEditor: {
			fileName: "user-service.js",
			content: `// User management service
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
  
  // User authentication service
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
}`,
			hasChanges: true,
		},
		aliceAction: "Code successfully shared",
		bobAction: "Changes applied to Bob's file",
		duration: 2000,
	},
];

export function EnhancedDemo() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [showOverlay, setShowOverlay] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		setReducedMotion(shouldReduceMotion ?? false);
	}, [shouldReduceMotion]);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const nextStep = () => {
		if (currentStep < demoSteps.length - 1) {
			// Clear any existing overlay timeout when manually navigating
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
			setShowOverlay(false);
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			// Clear any existing overlay timeout when manually navigating
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
			setShowOverlay(false);
			setCurrentStep(currentStep - 1);
		}
	};

	const skipToStep = (stepIndex: number) => {
		setCurrentStep(stepIndex);
		if (isPlaying) {
			setIsPlaying(false);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}
		// Clear any existing overlay timeout when manually navigating
		if (overlayTimeoutRef.current) {
			clearTimeout(overlayTimeoutRef.current);
		}
		setShowOverlay(false);
	};

	const playDemo = () => {
		setIsPlaying(true);
		setCurrentStep(0);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			setCurrentStep(prev => {
				if (prev >= demoSteps.length - 1) {
					clearInterval(intervalRef.current!);
					setIsPlaying(false);
					return prev;
				}
				return prev + 1;
			});
		}, 3000);
	};

	const pauseDemo = () => {
		setIsPlaying(false);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const restartDemo = () => {
		setIsPlaying(false);
		setCurrentStep(0);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
		};
	}, []);

	// Handle overlay timeout for manual navigation
	useEffect(() => {
		const step = demoSteps[currentStep];

		if (step.showSharing) {
			setShowOverlay(true);
			// Clear any existing timeout
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
			// Set timeout to hide overlay after 2.5 seconds
			overlayTimeoutRef.current = setTimeout(() => {
				setShowOverlay(false);
			}, 2500);
		} else {
			setShowOverlay(false);
			// Clear timeout if step doesn't show sharing
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
		}

		return () => {
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
		};
	}, [currentStep]);

	const step = demoSteps[currentStep];

	const EditorView = ({
		user,
		editor,
		action,
		isActive,
	}: {
		user: { name: string; avatar: string; color: string };
		editor: EditorState;
		action?: string;
		isActive: boolean;
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: reducedMotion ? 0 : 0.5 }}
			className={`relative rounded-lg border transition-all duration-300 ${
				isActive ? "border-primary/50 shadow-lg" : "border-border bg-card"
			}`}
		>
			{/* Editor Header */}
			<div className="flex items-center justify-between p-3 border-b border-border">
				<div className="flex items-center gap-3">
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${user.color}`}
					>
						{user.avatar}
					</div>
					<div>
						<div className="font-medium">{user.name}</div>
						<div className="text-sm text-muted-foreground">{editor.fileName}</div>
					</div>
				</div>
				{editor.hasChanges && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="w-2 h-2 rounded-full bg-primary"
					/>
				)}
			</div>

			{/* Editor Content */}
			<div className="p-4">
				<div className="bg-muted/30 rounded-lg p-4 border">
					<div className="flex items-center gap-2 mb-3">
						<div className="flex gap-1.5">
							<div className="h-2 w-2 rounded-full bg-red-500/80"></div>
							<div className="h-2 w-2 rounded-full bg-yellow-500/80"></div>
							<div className="h-2 w-2 rounded-full bg-green-500/80"></div>
						</div>
						<span className="text-xs text-muted-foreground font-mono">{editor.fileName}</span>
					</div>
					<pre className="text-sm font-mono overflow-x-auto text-start">
						<code className="text-foreground">
							{editor.content.split("\n").map((line, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0 }}
									animate={{
										opacity: editor.selectedLines?.includes(index + 1) ? 1 : 0.7,
										backgroundColor: editor.selectedLines?.includes(index + 1)
											? "rgba(57, 255, 20, 0.1)"
											: "transparent",
									}}
									transition={{
										delay: reducedMotion ? 0 : index * 0.05,
										duration: reducedMotion ? 0 : 0.3,
									}}
									className="px-2 py-0.5 rounded relative"
								>
									<span className="text-muted-foreground mr-4 text-xs">
										{String(index + 1).padStart(2, " ")}
									</span>
									{line}
									{editor.cursorPosition && editor.cursorPosition.line === index + 1 && (
										<motion.span
											animate={{ opacity: [1, 0, 1] }}
											transition={{ duration: 1, repeat: Infinity }}
											className="inline-block w-0.5 h-4 bg-primary ml-1"
										/>
									)}
								</motion.div>
							))}
						</code>
					</pre>
				</div>
			</div>

			{/* Action Indicator */}
			{action && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="p-3 border-t border-border bg-muted/30"
				>
					<div className="flex items-center gap-2 text-sm">
						<Zap className="h-4 w-4 text-primary" />
						<span className="text-muted-foreground">{action}</span>
					</div>
				</motion.div>
			)}
		</motion.div>
	);

	return (
		<div className="relative rounded-lg border border-border bg-card p-6 max-w-6xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="flex gap-1.5">
						<div className="h-3 w-3 rounded-full bg-red-500/80"></div>
						<div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
						<div className="h-3 w-3 rounded-full bg-green-500/80"></div>
					</div>
					<span className="text-sm text-muted-foreground font-mono">Osmynt Enhanced Demo</span>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={isPlaying ? pauseDemo : playDemo}
						className="gap-2 cursor-pointer"
					>
						{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
						{isPlaying ? "Pause" : "Play Demo"}
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={restartDemo}
						className="gap-2 cursor-pointer"
					>
						<RotateCcw className="h-4 w-4" />
						Restart
					</Button>
				</div>
			</div>

			{/* Progress Indicator */}
			<div className="flex items-center justify-center gap-2 mb-6">
				{demoSteps.map((_, index) => (
					<button
						type="button"
						key={index}
						onClick={() => skipToStep(index)}
						className={`h-2 w-8 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${
							index === currentStep
								? "bg-primary scale-110"
								: index < currentStep
									? "bg-primary/50 hover:bg-primary/70"
									: "bg-muted hover:bg-muted-foreground/50"
						}`}
						aria-label={`Go to step ${index + 1}`}
					/>
				))}
			</div>

			{/* Step Counter */}
			<div className="text-center mb-6">
				<span className="text-sm text-muted-foreground">
					Step {currentStep + 1} of {demoSteps.length}
				</span>
			</div>

			{/* Main Content - Dual Editor View */}
			<div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
				{/* Alice's Editor */}
				<EditorView
					user={{ name: "Alice", avatar: "A", color: "bg-blue-500" }}
					editor={step.aliceEditor}
					action={step.aliceAction}
					isActive={!!step.aliceAction}
				/>

				{/* Bob's Editor */}
				<EditorView
					user={{ name: "Bob", avatar: "B", color: "bg-green-500" }}
					editor={step.bobEditor}
					action={step.bobAction}
					isActive={!!step.bobAction}
				/>
			</div>

			{/* Overlay Elements */}
			<AnimatePresence>
				{showOverlay && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg"
					>
						<div className="bg-card border border-primary/50 rounded-lg p-6 shadow-lg">
							<div className="flex items-center gap-3 mb-4">
								<Shield className="h-6 w-6 text-primary" />
								<div>
									<div className="font-semibold">Encrypting & Sharing</div>
									<div className="text-sm text-muted-foreground">
										Code is being encrypted and sent to team
									</div>
								</div>
							</div>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
								className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"
							/>
						</div>
					</motion.div>
				)}

				{step.showNotification && (
					<motion.div
						initial={{ opacity: 0, x: 100, y: -100 }}
						animate={{ opacity: 1, x: 0, y: 0 }}
						exit={{ opacity: 0, x: 100, y: -100 }}
						className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-lg p-3 shadow-lg z-10"
					>
						<div className="flex items-center gap-2">
							<AlertCircle className="h-4 w-4" />
							<span className="text-sm font-medium">New code shared!</span>
						</div>
					</motion.div>
				)}

				{step.showCodeBlocks && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="absolute bottom-4 right-4 bg-card border border-primary/50 rounded-lg p-4 shadow-lg z-10 max-w-sm"
					>
						<div className="flex items-center gap-2 mb-3">
							<Eye className="h-4 w-4 text-primary" />
							<span className="font-medium">Shared Code Blocks</span>
						</div>
						<div className="space-y-2">
							<div className="p-3 bg-muted/50 rounded border border-primary/20">
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium text-sm">Authentication Service</div>
										<div className="text-xs text-muted-foreground">auth.js • Lines 1-18</div>
									</div>
									<Button type="button" size="sm" variant="secondary">
										View
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				)}

				{step.showDiff && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="absolute top-4 right-4 bg-card border border-primary/50 rounded-lg p-4 shadow-lg z-10 max-w-sm"
					>
						<div className="flex items-center gap-2 mb-3">
							<GitBranch className="h-4 w-4 text-primary" />
							<span className="font-medium">Git Diff Preview</span>
						</div>
						<div className="space-y-1 text-sm font-mono">
							<div className="text-green-600">
								+ const authenticateUser = async (credentials) =&gt; {"{"}
							</div>
							<div className="text-green-600">
								+ const response = await fetch(&apos;/api/auth&apos;, {"{"}
							</div>
							<div className="text-green-600">+ method: &apos;POST&apos;,</div>
							<div className="text-green-600">
								+ headers: {"{"} &apos;Content-Type&apos;: &apos;application/json&apos; {"}"},
							</div>
							<div className="text-green-600">+ body: JSON.stringify(credentials)</div>
							<div className="text-green-600">+ {"}"});</div>
						</div>
						<div className="mt-3 flex gap-2">
							<Button type="button" size="sm">
								Apply Changes
							</Button>
							<Button type="button" size="sm" variant="secondary">
								Preview
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Step Description */}
			<motion.div
				key={`description-${currentStep}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: reducedMotion ? 0 : 0.5 }}
				className="mt-6 text-center"
			>
				<h4 className="text-lg font-semibold mb-2">{step.title}</h4>
				<p className="text-muted-foreground max-w-2xl mx-auto">{step.description}</p>
			</motion.div>

			{/* Navigation */}
			<div className="flex items-center justify-between mt-6">
				<Button
					type="button"
					variant="secondary"
					onClick={prevStep}
					disabled={currentStep === 0}
					className="gap-2"
				>
					<ChevronLeft className="h-4 w-4" />
					Previous
				</Button>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={() => skipToStep(Math.max(0, currentStep - 1))}
						disabled={currentStep === 0}
					>
						<SkipBack className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={() => skipToStep(Math.min(demoSteps.length - 1, currentStep + 1))}
						disabled={currentStep === demoSteps.length - 1}
					>
						<SkipForward className="h-4 w-4" />
					</Button>
				</div>

				<Button
					type="button"
					onClick={nextStep}
					disabled={currentStep === demoSteps.length - 1}
					className="gap-2"
				>
					Next
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Accessibility Notice */}
			{reducedMotion && (
				<div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
					<p className="text-sm text-muted-foreground">
						Animations are reduced for better accessibility.
						<Button type="button" variant="link" size="sm" onClick={() => setReducedMotion(false)}>
							Enable animations
						</Button>
					</p>
				</div>
			)}
		</div>
	);
}
