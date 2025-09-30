import { client as api } from "api";

type LeaveTeam = {
	teamId: string;
	token: string;
};

export const leaveTeam = async (payload: LeaveTeam) => {
	const { teamId, token } = payload;
	const response = await api("protected", token).teams[teamId].leave.$delete();

	if (!response.ok) {
		throw new Error("Failed to leave team");
	}

	await response.json();

	return { success: true };
};
