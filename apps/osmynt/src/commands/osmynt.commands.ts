import { ACCESS_SECRET_KEY, LANGUAGE_BY_EXT, REFRESH_SECRET_KEY } from "@/constants/constants";
import type { OsmyntTreeProvider } from "@/provider/osmynt.provider";
import {
	ensureDeviceKeys,
	getBaseAndAccess,
	nativeSecureLogin,
	pickShareTarget,
	promptTeamId,
	shareSelectedCode,
	tryDecryptSnippet,
} from "@/services/osmynt.services";
import { extractInviteToken } from "@/utils/osmynt.utils";
import * as vscode from "vscode";

export async function handleLogin(
	context: vscode.ExtensionContext,
	tree: OsmyntTreeProvider,
	connectRealtime: (context: vscode.ExtensionContext, treeProvider: OsmyntTreeProvider) => Promise<void>
) {
	try {
		const session = await vscode.authentication.getSession("github", ["read:user", "user:email"], {
			createIfNone: true,
		});
		if (!session) {
			vscode.window.showErrorMessage("GitHub authentication failed.");
			return;
		}
		await nativeSecureLogin(context, session.accessToken);
		try {
			await connectRealtime(context, tree);
		} catch {
			// vscode.window.showErrorMessage("Failed to connect to realtime");
		}
		tree.refresh();
	} catch (e) {
		vscode.window.showErrorMessage(`Login failed: ${e}`);
	}
}

export async function handleLogout(
	context: vscode.ExtensionContext,
	tree: OsmyntTreeProvider,
	disconnectRealtime: (context: vscode.ExtensionContext) => Promise<void>
) {
	await context.secrets.delete(ACCESS_SECRET_KEY);
	await context.secrets.delete(REFRESH_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", false);
	vscode.window.showInformationMessage("Logged out of Osmynt.");
	try {
		await disconnectRealtime(context);
	} catch {}
	tree.refresh();
}

export async function handleShareCode(context: vscode.ExtensionContext, treeProvider: OsmyntTreeProvider) {
	const editor = vscode.window.activeTextEditor;
	if (!editor || editor.selection.isEmpty) {
		vscode.window.showWarningMessage("Select some code to share.");
		return;
	}
	const selected = editor.document.getText(editor.selection);
	const includeContext = await vscode.window.showQuickPick(
		[{ label: "Include file name and extension", picked: true }, { label: "Don't include" }],
		{ canPickMany: false, placeHolder: "Include file context in snippet metadata?" }
	);
	const title = await vscode.window.showInputBox({ prompt: "Snippet title (required)" });
	if (!title || title.trim().length === 0) {
		vscode.window.showWarningMessage("Snippet title is required.");
		return;
	}
	const target = await pickShareTarget(context);
	try {
		await ensureDeviceKeys(context);
		const editorFile = editor.document.uri.fsPath || "";
		const metadataExtra: any = {};
		if (includeContext?.label?.startsWith("Include")) {
			metadataExtra.filePath = editorFile;
			metadataExtra.fileExt = (editorFile.split(".").pop() || "").toLowerCase();
		}
		await shareSelectedCode(context, selected, title.trim(), target, metadataExtra);
		treeProvider.refresh();
		vscode.window.showInformationMessage("Osmynt: Snippet shared securely");
	} catch (e) {
		vscode.window.showErrorMessage(`Share failed: ${e}`);
	}
}

export async function handleInviteMember(context: vscode.ExtensionContext) {
	try {
		const teamId = await promptTeamId(context);
		if (!teamId) {
			vscode.window.showWarningMessage("No team ID provided");
			return;
		}
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/protected/teams/${encodeURIComponent(teamId)}/invite`, {
			method: "POST",
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		await vscode.env.clipboard.writeText(j.token);
		vscode.window.showInformationMessage("Invitation token copied to clipboard");
	} catch (e) {
		vscode.window.showErrorMessage(`Invite failed: ${e}`);
	}
}

export async function handleAcceptInvitation(context: vscode.ExtensionContext, treeProvider: OsmyntTreeProvider) {
	try {
		const raw = await vscode.window.showInputBox({ prompt: "Enter invitation token or URL" });
		if (!raw) return;
		const token = extractInviteToken(raw);
		if (!token) return;
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/protected/teams/invite/${encodeURIComponent(token)}`, {
			method: "POST",
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		vscode.window.showInformationMessage("Joined team successfully");
		// refresh the team view
		treeProvider?.refresh();
		setTimeout(() => {
			// force refresh by toggling view
			vscode.commands.executeCommand("workbench.action.closePanel");
			vscode.commands.executeCommand("workbench.view.extension.osmynt");
		}, 150);
	} catch (e) {
		vscode.window.showErrorMessage(`Accept failed: ${e}`);
	}
}

export async function handleRefreshTeam(treeProvider: OsmyntTreeProvider) {
	try {
		await vscode.commands.executeCommand("workbench.view.extension.osmynt");
		treeProvider?.refresh();
	} catch {}
}

export async function handleViewSnippet(context: vscode.ExtensionContext, id?: string) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const snippetId = id ?? (await vscode.window.showInputBox({ prompt: "Enter snippet id" }));
		if (!snippetId) return;
		const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(snippetId)}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		if (!res.ok) throw new Error(j?.error || `Failed (${res.status})`);
		const text = await tryDecryptSnippet(context, j);
		const fileExt = (j?.metadata?.fileExt as string | undefined)?.toLowerCase();
		const languageByExt: Record<string, string> = LANGUAGE_BY_EXT;
		const language = (fileExt && languageByExt[fileExt]) || "plaintext";
		const doc = await vscode.workspace.openTextDocument({
			language,
			content: text ?? "[Encrypted snippet opened. Decrypt failed or not addressed to this device.]",
		});
		await vscode.window.showTextDocument(doc, { preview: false });
	} catch (e) {
		vscode.window.showErrorMessage(`Open failed: ${e}`);
	}
}
