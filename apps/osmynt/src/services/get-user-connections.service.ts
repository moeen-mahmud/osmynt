import { client as api } from "api";

type Payload = {
	token: string;
};

export const getUserConnections = async (payload: Payload) => {
	const response = await api("protected", payload.token).connections["get-all"].$get();

	if (!response.ok) {
		return []; //@Archisman-Mridha: What if I do this?
	}

	const data = await response.json();

	return data.payload?.connections;
};
