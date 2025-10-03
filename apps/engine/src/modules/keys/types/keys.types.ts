export type DeviceKeyRecord = {
	userId: string;
	deviceId: string;
	encryptionPublicKeyJwk: unknown;
	signingPublicKeyJwk?: unknown;
	algorithm: string;
};
