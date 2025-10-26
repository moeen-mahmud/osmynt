export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	isLoggedIn: boolean;
	teamId?: string;
}

export interface CodeBlock {
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

export interface TeamMember {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: "OWNER" | "MEMBER";
	status: "online" | "offline" | "away";
}
