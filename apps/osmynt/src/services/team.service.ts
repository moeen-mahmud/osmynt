import { client as api } from "api";

type Payload = {
	token: string;
};

type InvitePayload = {
	token: string;
	teamId: string;
};

type JoinPayload = {
	token: string;
	inviteToken: string;
};

type Members = {
	userId: string;
	role: string;
};

export type Team = {
	_id: string;
	name: string;
	ownerId: string;
	members: Members[];
};

export const getUserTeams = async (payload: Payload): Promise<Team[]> => {
	const response = await api("protected", payload.token).teams["get-all"].$get();

	if (!response.ok) {
		return [];
	}

	const data = await response.json();
	return data?.payload;
};

export const inviteTeamMember = async (payload: InvitePayload) => {
	const response = await api("protected", payload.token).teams[`${payload.teamId}/invite`].$post();

	if (!response.ok) {
		return false;
	}

	const data = await response.json();
	return data?.payload;
};

export const joinTeam = async (payload: JoinPayload): Promise<boolean> => {
	const response = await api("protected", payload.token).teams[`join/${payload.inviteToken}`].$post();

	if (!response.ok) {
		return false;
	}

	const data = await response.json();
	return data?.payload?.success || false;
};
