export const USER_KEYS = (userId: string) => `osmynt:keys:${userId}`;
export const DEVICE_KEY = (userId: string, deviceId: string) => `osmynt:key:${userId}:${deviceId}`;

export const KEYS_AUDIT_LOG_ACTIONS = {
	DEVICE_KEY_REGISTERED: "DEVICE_KEY_REGISTERED",
	DEVICE_KEY_DELETED: "DEVICE_KEY_DELETED",
	USER_KEYS_CLEARED: "USER_KEYS_CLEARED",
	TEAM_RECIPIENTS_DELETED: "TEAM_RECIPIENTS_DELETED",
};
