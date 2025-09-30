import * as vscode from "vscode";
import { checkToken } from "../services/check-token.service";
import { handleTokenExpiration } from "./token-expiration.handle";
import type { StateHandler } from "./state.handle";

export async function validateAndRefreshToken(context: vscode.ExtensionContext, state: StateHandler) {
	try {
		const token = await context.secrets.get("osmynt.token");
		const privateKey = await context.secrets.get("osmynt.privateKey");
		if (!token || !privateKey) {
			vscode.window.showInformationMessage("Please login to start using Osmynt");
			return null;
		}

		const tokenValidation = await checkToken({ token });
		if (tokenValidation?.cause?.name === "JwtTokenExpired") {
			await handleTokenExpiration(context, state);
			return null;
		}

		return token;
	} catch (error) {
		console.error("Token validation error:", error);
		vscode.window.showErrorMessage("Failed to validate authentication. Please try logging in again.");
		return null;
	}
}
