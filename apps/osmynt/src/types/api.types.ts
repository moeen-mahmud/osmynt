// Global type for JsonWebKey
declare global {
	interface JsonWebKey {
		kty: string;
		use?: string;
		key_ops?: string[];
		alg?: string;
		kid?: string;
		x5u?: string;
		x5c?: string[];
		x5t?: string;
		"x5t#S256"?: string;
		crv?: string;
		x?: string;
		y?: string;
		d?: string;
		n?: string;
		e?: string;
		p?: string;
		q?: string;
		dp?: string;
		dq?: string;
		qi?: string;
		oth?: Array<{
			r: string;
			d: string;
			t?: string;
		}>;
		k?: string;
		[key: string]: any;
	}
}

export interface ApiError {
	error: string;
}

export interface ApiSuccess {
	ok: true;
}

export interface AuthLoginResponse {
	serverPublicKeyJwk: JsonWebKey;
	payload: {
		ivB64u: string;
		ciphertextB64u: string;
	};
}

export interface KeysRegisterRequest {
	deviceId: string;
	encryptionPublicKeyJwk: JsonWebKey;
	signingPublicKeyJwk?: JsonWebKey;
	algorithm?: string;
}

export interface KeysRegisterResponse extends ApiSuccess {}

export interface DeviceKeySummary {
	deviceId: string;
	encryptionPublicKeyJwk: JsonWebKey;
	signingPublicKeyJwk?: JsonWebKey;
	isPrimary?: boolean;
}

export interface KeysMeResponse {
	devices: DeviceKeySummary[];
}

export interface DeviceKeyRecipient {
	userId: string;
	deviceId: string;
	encryptionPublicKeyJwk: JsonWebKey;
	signingPublicKeyJwk?: JsonWebKey;
}

export interface KeysTeamResponse {
	recipients: DeviceKeyRecipient[];
}

export interface PairingInitRequest {
	deviceId: string;
	ivB64u: string;
	ciphertextB64u: string;
	ttlMs?: number;
}

export interface PairingInitResponse {
	token: string;
}

export interface PairingClaimRequest {
	token: string;
}

export interface PairingClaimResponse {
	ivB64u: string;
	ciphertextB64u: string;
}

export interface DeviceRemoveResponse extends ApiSuccess {}

// Teams API Types
export interface User {
	id: string;
	githubId: string;
	name: string;
	email: string;
	avatarUrl: string;
	metadata: any;
	createdAt: string;
	updatedAt: string;
}

export interface UserPublic {
	id: string;
	name: string;
	email: string;
	avatarUrl: string;
}

export interface Team {
	id: string;
	name: string;
	slug: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

export interface TeamMember {
	id: string;
	teamId: string;
	userId: string;
	role: "OWNER" | "MEMBER";
	createdAt: string;
	updatedAt: string;
}

export interface TeamsMeResponse {
	user: { id: string };
	teams: Pick<Team, "id" | "name" | "slug" | "ownerId">[];
	membersByTeam: Record<string, UserPublic[]>;
}

export interface TeamsInviteResponse {
	token: string;
}

export interface TeamsAcceptResponse extends ApiSuccess {}

export interface TeamsRemoveMemberResponse {
	ok: boolean;
}

// Code Share API Types
export interface WrappedKey {
	recipientUserId: string;
	recipientDeviceId: string;
	senderEphemeralPublicKeyJwk: JsonWebKey;
	wrappedCekB64u: string;
	wrapIvB64u: string;
}

export interface CodeShareMetadata {
	teamId?: string;
	title: string;
	filePath?: string;
	fileExt?: string;
	projectRoot?: string;
	relativeFilePath?: string;
	startLine?: number;
	endLine?: number;
	fullFileContent?: string;
	isDiffApplicable?: boolean;
	[key: string]: any; // Allow additional metadata
}

export interface CodeShareRequest {
	ciphertextB64u: string;
	ivB64u: string;
	aad?: string;
	wrappedKeys: WrappedKey[];
	metadata?: CodeShareMetadata;
}

export interface CodeShareResponse {
	id: string;
}

export interface CodeShareListItem {
	id: string;
	createdAt: string;
	authorId: string;
	authorName: string;
	metadata: CodeShareMetadata;
}

export interface CodeShareListTeamResponse {
	items: CodeShareListItem[];
}

export interface CodeShareGetByIdResponse {
	ver: number;
	alg: string;
	id: string;
	authorId: string;
	createdAt: string;
	ciphertextB64u: string;
	ivB64u: string;
	aad?: string | null;
	wrappedKeys: WrappedKey[];
	metadata?: CodeShareMetadata;
}

export interface CodeShareAddWrappedKeysRequest {
	wrappedKeys: WrappedKey[];
}

export interface CodeShareAddWrappedKeysResponse extends ApiSuccess {}

export interface CodeShareListTeamByAuthorResponse {
	items: CodeShareListItem[];
}

export interface CodeShareListDmWithResponse {
	items: CodeShareListItem[];
}

// Realtime/WebSocket Types
export interface RealtimeMessage {
	event: string;
	payload: any;
}

export interface SnippetCreatedEvent {
	event: "snippet:created";
	payload: {
		id: string;
		authorId: string;
		authorName: string;
		firstRecipientName?: string;
		teamName?: string;
		title?: string;
	};
}

export interface KeysChangedEvent {
	event: "keys:changed";
	payload: {
		userId: string;
	};
}

export interface TeamMemberJoinedEvent {
	event: "team:memberJoined";
	payload: {
		teamId: string;
		userId: string;
	};
}

export type ApiResponse<T> = T | ApiError;

export type RealtimeEvent = SnippetCreatedEvent | KeysChangedEvent | TeamMemberJoinedEvent;
