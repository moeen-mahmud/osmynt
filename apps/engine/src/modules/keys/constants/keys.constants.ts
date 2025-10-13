import { OSMYNT_KEYS } from "@/config/constants";

export const USER_KEYS = (userId: string) => `${OSMYNT_KEYS}:${userId}`;
export const DEVICE_KEY = (userId: string, deviceId: string) => `${OSMYNT_KEYS}:${userId}:${deviceId}`;

export const KEYS_AUDIT_LOG_ACTIONS = {
	DEVICE_KEY_REGISTERED: "DEVICE_KEY_REGISTERED",
	DEVICE_KEY_DELETED: "DEVICE_KEY_DELETED",
	USER_KEYS_CLEARED: "USER_KEYS_CLEARED",
	TEAM_RECIPIENTS_DELETED: "TEAM_RECIPIENTS_DELETED",
};
