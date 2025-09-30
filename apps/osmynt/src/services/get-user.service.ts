import { client as api } from "api";

type Payload = {
	token: string;
};

export const getLoggedInUser = async (payload: Payload) => {
	const response = await api("protected", payload.token).user.me.$get();

	if (!response.ok) {
		throw new Error("Failed to get user");
	}

	const data = await response.json();

	return data.payload;
};

export const getUserById = async (payload: Payload & { userId: string }) => {
	const response = await api("protected", payload.token).user[payload.userId].$get();

	if (!response.ok) {
		throw new Error("Failed to get user");
	}

	const data = await response.json();

	return data.payload;
};
