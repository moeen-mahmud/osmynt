import { client as api } from "api";

type Login = {
	token: string;
};

export const login = async (payload: Login) => {
	const response = await api("auth")["login-with-token"].$post({
		json: payload,
	});

	if (!response.ok) {
		throw new Error("Login failed");
	}

	const data = await response.json();

	return data.payload;
};
