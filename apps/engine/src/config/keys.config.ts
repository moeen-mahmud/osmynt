export const cookieKeys = {
	accessToken: "turbogist-access_token",
	refreshToken: "turbogist-refresh_token",
};

export const AuditLogActions = {
	userActions: {
		USER_CREATED_EXT: "USER_CREATED_EXT",
		USER_UPDATED_EXT: "USER_UPDATED_EXT",
		USER_LAST_LOGIN_UPDATED_EXT: "USER_LAST_LOGIN_UPDATED_EXT",
		USER_DELETED_EXT: "USER_DELETED_EXT",
		USER_ONBOARDING_PREFERENCES_UPDATED_EXT: "USER_ONBOARDING_PREFERENCES_UPDATED_EXT",
	},
	organizationActions: {
		TEAM_CREATED_EXT: "TEAM_CREATED_EXT",
		TEAM_UPDATED_EXT: "TEAM_UPDATED_EXT",
		TEAM_DELETED_EXT: "TEAM_DELETED_EXT",
	},
};

export const AuthCookieKeys = {
	session: "osmynt-session",
};
