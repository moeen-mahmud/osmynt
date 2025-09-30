import prisma from "@/config/database.config";
import { ENV } from "@/config/env.config";
import { GITHUB_ACCESS_TOKEN_URL, GITHUB_EMAIL_URL, GITHUB_GET_USER_URL } from "@/config/constants";
import { signJwtHS256 } from "@/utils/jwt.util";

type GithubTokenResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

type GithubUser = {
	id: number;
	login: string;
	avatar_url: string;
	name: string | null;
};

type GithubEmail = {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
};

export class AuthService {
	static async exchangeCodeForToken(code: string): Promise<string> {
		const res = await fetch(GITHUB_ACCESS_TOKEN_URL, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				client_id: ENV.GITHUB.CLIENT_ID,
				client_secret: ENV.GITHUB.CLIENT_SECRET,
				code,
				redirect_uri: ENV.GITHUB.REDIRECT_URI,
			}),
		});
		if (!res.ok) {
			throw new Error("Failed to exchange code for token");
		}
		const data = (await res.json()) as GithubTokenResponse;
		return data.access_token;
	}

	static async fetchGithubUser(accessToken: string): Promise<{ user: GithubUser; email: string }> {
		const userRes = await fetch(GITHUB_GET_USER_URL, {
			headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
		});
		if (!userRes.ok) throw new Error("Failed to fetch GitHub user");
		const user = (await userRes.json()) as GithubUser;

		const emailRes = await fetch(GITHUB_EMAIL_URL, {
			headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
		});
		if (!emailRes.ok) throw new Error("Failed to fetch GitHub emails");
		const emails = (await emailRes.json()) as GithubEmail[];
		const primary = emails.find(e => e.primary) ?? emails[0];
		if (!primary) throw new Error("No email found for GitHub user");

		return { user, email: primary.email };
	}

	static async findOrCreateUser(github: { id: number; name: string | null; avatar: string; email: string }) {
		const existing = await prisma.user.findFirst({ where: { githubId: String(github.id) } });
		if (existing) return existing;

		const created = await prisma.user.create({
			data: {
				githubId: String(github.id),
				name: github.name ?? "GitHub User",
				email: github.email,
				avatarUrl: github.avatar,
				metadata: {},
			},
		});
		// Ensure default personal team (best-effort; skip if model not generated yet)
		const anyPrisma = prisma as unknown as { team?: any };
		let teamId: string | null = null;
		if (anyPrisma.team) {
			const slug = `team-${created.id.slice(0, 8)}`;
			const team = await anyPrisma.team.create({
				data: {
					name: `${created.name}'s Team`,
					slug,
					ownerId: created.id,
					Members: {
						create: [{ userId: created.id, role: "OWNER" }],
					},
				},
			});
			teamId = team.id as string;
		}
		await prisma.auditLog.create({
			data: {
				action: "USER_CREATED_EXT",
				userId: created.id,
				metadata: { teamId },
			},
		});
		return created;
	}

	static async issueTokens(userId: string) {
		if (!ENV.JWT_SECRET) throw new Error("JWT secret missing");
		const access = await signJwtHS256({ sub: userId, typ: "access" }, ENV.JWT_SECRET, 60 * 60 * 12);
		const refresh = await signJwtHS256({ sub: userId, typ: "refresh" }, ENV.JWT_SECRET, 60 * 60 * 24 * 30);
		return { access, refresh };
	}
}
