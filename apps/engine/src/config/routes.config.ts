export const Routes = {
	basePath: "/osmynt-api-engine",
	doc: "/doc",

	reference: "/reference",

	health: "/health",

	// Auth
	auth: {
		base: "/auth",
		github: "/github",
		callback: "/callback",
		refresh: "/refresh",
		loginWithToken: "/login-with-token",
		logout: "/protected/logout",
		checkToken: "/check-token",
		betaSignup: "/beta-signup",
		handshakeInit: "/handshake/init",
		handshakeRetrieve: "/handshake/retrieve",
	},

	// User
	user: {
		base: "/protected/user",
		extensionBase: "/extension/user",
		getAll: "/get-all",
		me: "/me",
		getById: "/:id",
	},

	// connections
	connections: {
		base: "/protected/connections",
		extensionBase: "/extension/connections",
		connect: "/connect",
		disconnect: "/disconnect",
		disconnectMultiple: "/disconnect-multiple",
		disconnectAll: "/disconnect-all",
		getAll: "/get-all",
	},

	// code share
	codeShare: {
		base: "/protected/code-share",
		extensionBase: "/extension/code-share",
		share: "/share",
		shareTeam: "/share-team",
		checkOnline: "/check-online",
		deliverPendingCodes: "/deliver-pending-codes",
	},

	// teams
	teams: {
		base: "/protected/teams",
		extensionBase: "/extension/teams",
		create: "/create",
		generateTeamInvitationLink: "/:teamId/invite",
		getInvitationByToken: "/invite/:inviteToken",
		join: "/join/:inviteToken",
		getAll: "/get-all",
		getById: "/:teamId",
		leave: "/:teamId/leave",
		removeTeamMember: "/:teamId/remove-member/:memberId",
		checkTeamNameExists: "/check-team-name-exists",
		updateTeamName: "/update-team-name",
		getLatestTeamActivity: "/:teamId/activity",
	},

	codeSnippet: {
		base: "/protected/code-snippet",
		upload: "/upload",
		search: "/search",
		getAll: "/get-all",
		getById: "/:id",
		getPresignedUrl: "/:id/get-presigned-url",
		delete: "delete/:fileKey",
	},

	// socket
	socket: "/socket",
};
