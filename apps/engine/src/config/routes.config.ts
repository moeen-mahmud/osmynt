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

	keys: {
		base: "/protected/keys",
		register: "/register",
		me: "/me",
		teamDefault: "/team/default",
	},

	// code share
	codeShare: {
		base: "/protected/code-share",
		extensionBase: "/extension/code-share",
		share: "/share",
		listTeam: "/team/list",
		getById: "/:id",
		shareTeam: "/share-team",
		checkOnline: "/check-online",
		deliverPendingCodes: "/deliver-pending-codes",
	},

	// teams
	teams: {
		base: "/protected/teams",
		me: "/me",
		invite: "/:teamId/invite",
		accept: "/invite/:inviteToken",
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
