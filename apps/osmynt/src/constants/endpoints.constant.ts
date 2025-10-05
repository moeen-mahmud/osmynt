import { ENV } from "@/config/env.config";

export const ENDPOINTS = {
    engineBaseUrl: ENV.isDev ? "http://localhost:3000" : ENV.engineBaseUrl,
    base: "osmynt-api-engine",
    auth: {
        loginWithToken: "auth/login-with-token",
    },
    keys: {
        register: "protected/keys/register",
        teamById: (teamId: string) => `protected/keys/team/${teamId}`,
    },
    teams: {
        me: "protected/teams/me",
        invite: (token: string) => `protected/teams/invite/${token}`,
        removeTeamMember: (teamId: string, userId: string) => `protected/teams/${teamId}/remove-member/${userId}`,
    },
    codeShare: {
        share: "protected/code-share/share",
        getById: (id: string) => `protected/code-share/${id}`,
        listTeam: "protected/code-share/team/list",
        listTeamByAuthor : (teamId: string, authorId: string) => `protected/code-share/team/${teamId}/by-author/${authorId}`,
        dmWith: (userId: string) => `protected/code-share/dm/with/${userId}`,
    }
}