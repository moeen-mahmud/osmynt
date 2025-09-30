import { client as api } from "api";

export type ShareCode = {
	// action: "share_code";
	teamId: string;
	subject: string;
	recipientUserName?: string;
	code: string;
	editorData: {
		fileName: string;
		languageId: string;
		startLine: number;
		endLine: number;
	};
};

export enum ShareType {
	INDIVIDUAL = "individual",
	TEAM = "team",
}

export const shareCode = async (payload: ShareCode, token: string, shareType: ShareType) => {
	const response =
		shareType === ShareType.INDIVIDUAL
			? await api("protected", token)["code-share"].share.$post({
					json: payload,
				})
			: await api("protected", token)["code-share"]["share-team"].$post({
					json: payload,
				});

	if (!response.ok) {
		throw new Error("Failed to share code");
	}

	const data = await response.json();

	return data.payload;
};
