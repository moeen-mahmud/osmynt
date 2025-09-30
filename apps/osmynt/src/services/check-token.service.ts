import { client as api } from "@osmynt-core/api";
import * as vscode from "vscode";

type Payload = {
	token: string;
};

export const checkToken = async (payload: Payload) => {
	const response = await api("auth")["check-token"].$post({
		json: payload,
	});

	const data = await response.json();

	return data;
};
