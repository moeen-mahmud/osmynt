import { ENV } from "@/config/env.config";

export const ENDPOINTS = {
	engineBaseUrl: ENV.engineBaseUrl,
	base: "osmynt-api-engine",
	auth: {
		loginWithToken: "auth/login-with-token",
	},
	keys: {
		register: "protected/keys/register",
		me: "protected/keys/me",
		teamById: (teamId: string) => `protected/keys/team/${teamId}`,
		pairingInit: "protected/keys/pairing/init",
		pairingClaim: "protected/keys/pairing/claim",
		deviceRemove: (deviceId: string) => `protected/keys/device/${deviceId}`,
		deviceForceRemove: (deviceId: string) => `protected/keys/device/${deviceId}/force`,
	},
	teams: {
		me: "protected/teams/me",
		inviteCreate: (teamId: string) => `protected/teams/${teamId}/invite`,
		accept: (token: string) => `protected/teams/invite/${token}`,
		removeTeamMember: (teamId: string, userId: string) => `protected/teams/${teamId}/remove-member/${userId}`,
	},
	codeShare: {
		share: "protected/code-share/share",
		getById: (id: string) => `protected/code-share/${id}`,
		listTeam: "protected/code-share/team/list",
		addWrappedKeys: (id: string) => `protected/code-share/${id}/add-wrapped-keys`,
		listTeamByAuthor: (teamId: string, authorId: string) =>
			`protected/code-share/team/${teamId}/by-author/${authorId}`,
		dmWith: (userId: string) => `protected/code-share/dm/with/${userId}`,
	},
};
