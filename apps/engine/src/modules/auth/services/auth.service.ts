import prisma from "@/config/database.config";
import { ENV } from "@/config/env.config";
import { GITHUB_ACCESS_TOKEN_URL, GITHUB_EMAIL_URL, GITHUB_GET_USER_URL } from "@/config/constants";
import { signJwtHS256 } from "@/utils/jwt.util";
import type { StoredHandshake } from "@/modules/auth/types/auth.types";
import { HandshakeStore } from "@/modules/auth/services/handshake.store";
import type { GithubTokenResponse, GithubUser, GithubEmail } from "@/modules/auth/types/auth.types";
import { logger } from "@osmynt-core/library";
import { AUTH_AUDIT_LOG_ACTIONS } from "@/modules/auth/constants/auth.constant";

export class AuthService {
	static fetchGithubToken = async (code: string) => {
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
		logger.success("Github token fetched successfully", { data });
		return data.access_token;
	};

	static async exchangeCodeForToken(code: string): Promise<string> {
		return AuthService.fetchGithubToken(code);
	}

	static async fetchGithubUser(accessToken: string): Promise<{ user: GithubUser; email: string }> {
		const userRes = await fetch(GITHUB_GET_USER_URL, {
			headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
		});
		if (!userRes.ok) {
			logger.error("Failed to fetch GitHub user", { error: userRes.statusText });
			throw new Error("Failed to fetch GitHub user");
		}
		const user = (await userRes.json()) as GithubUser;
		logger.success("Github user fetched successfully", { user });
		const emailRes = await fetch(GITHUB_EMAIL_URL, {
			headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
		});
		if (!emailRes.ok) {
			logger.error("Failed to fetch GitHub emails", { error: emailRes.statusText });
			throw new Error("Failed to fetch GitHub emails");
		}
		const emails = (await emailRes.json()) as GithubEmail[];
		const primary = emails.find(e => e.primary) ?? emails[0];
		if (!primary) {
			logger.error("No email found for GitHub user");
			throw new Error("No email found for GitHub user");
		}
		logger.success("Github emails fetched successfully", { user, email: primary.email });
		return { user, email: primary.email };
	}

	static async findOrCreateUser(github: { id: number; name: string | null; avatar: string; email: string }) {
		const existing = await prisma.user.findFirst({ where: { githubId: String(github.id) } });
		if (existing) {
			logger.info("User already exists", { user: existing });
			return existing;
		}

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
		let teamId: string | null = null;
		if (prisma.team) {
			const slug = `team-${created.id.slice(0, 8)}`;
			const team = await prisma.team.create({
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
				action: AUTH_AUDIT_LOG_ACTIONS.USER_CREATED_EXT,
				userId: created.id,
				metadata: { teamId },
			},
		});
		logger.success("User created successfully", { user: created });
		return created;
	}

	static async issueTokens(userId: string) {
		if (!ENV.JWT_SECRET) {
			logger.error("JWT secret missing");
			throw new Error("JWT secret missing");
		}

		const access = await signJwtHS256({ sub: userId, typ: "access" }, ENV.JWT_SECRET, 60 * 60 * 12);
		const refresh = await signJwtHS256({ sub: userId, typ: "refresh" }, ENV.JWT_SECRET, 60 * 60 * 24 * 30);

		logger.success("Tokens issued successfully");
		return { access, refresh };
	}

	static async storeHandshake(id: string, data: StoredHandshake): Promise<void> {
		// Sanitize: never persist serverPrivateKeyJwk even if caller accidentally provided it
		const { serverPrivateKeyJwk, ...rest } = data as any;
		await HandshakeStore.save(id, rest as StoredHandshake, data.expiresAt - Date.now());
		logger.success("Stored handshake successfully", { id });
	}

	static async getHandshake(id: string): Promise<StoredHandshake | null> {
		const rec = await HandshakeStore.get(id);
		if (!rec) {
			logger.error("Failed to get handshake", { id });
			return null;
		}
		logger.success("Handshake retrieved successfully", { id });
		return rec;
	}
}
