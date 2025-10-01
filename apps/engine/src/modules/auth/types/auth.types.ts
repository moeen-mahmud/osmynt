export type GithubTokenResponse = {
	access_token: string;
	scope: string;
	token_type: string;
};

export type GithubUser = {
	id: number;
	login: string;
	avatar_url: string;
	name: string | null;
};

export type GithubEmail = {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
};

export type HandshakeRecord = {
	id: string;
	clientPublicKeyJwk: JsonWebKey;
	serverKeyPair?: { publicJwk: JsonWebKey; privateJwk: JsonWebKey };
	createdAt: number;
	encryptedPayload?: { ivB64u: string; ciphertextB64u: string };
};

export type StoredHandshake = {
	id: string;
	clientPublicKeyJwk: JsonWebKey;
	serverPublicKeyJwk?: JsonWebKey;
	serverPrivateKeyJwk?: JsonWebKey;
	encryptedPayload?: { ivB64u: string; ciphertextB64u: string };
	createdAt: number;
	expiresAt: number;
};
