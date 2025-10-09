import { ACCESS_SECRET_KEY, DEVICE_ID_KEY, LANGUAGE_BY_EXT, REFRESH_SECRET_KEY } from "@/constants/osmynt.constant";
import type { OsmyntTreeProvider } from "@/provider/osmynt.provider";
import {
	ensureDeviceKeys,
	getBaseAndAccess,
	nativeSecureLogin,
	pickShareTarget,
	promptTeamId,
	shareSelectedCode,
	tryDecryptSnippet,
	initiateDevicePairing,
	claimDevicePairing,
	removeDevice,
} from "@/services/osmynt.services";
import { extractInviteToken } from "@/utils/osmynt.utils";
import * as vscode from "vscode";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import { computeAndSetDeviceContexts, backfillAccessForCompanion, showDiffPreview } from "@/services/osmynt.services";

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

export async function handleAddDevicePrimary(context: vscode.ExtensionContext) {
	await initiateDevicePairing(context);
	await computeAndSetDeviceContexts(context);
}

export async function handleAddDeviceCompanion(context: vscode.ExtensionContext) {
	await claimDevicePairing(context);
	await computeAndSetDeviceContexts(context);
}

export async function handleRemoveDevice(context: vscode.ExtensionContext) {
	// Replace raw input with picker of available devices (companion only removable)
	try {
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/${ENDPOINTS.base}/protected/keys/me`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const j = await res.json();
		const devices: Array<{ deviceId: string; isPrimary?: boolean }> = Array.isArray(j?.devices) ? j.devices : [];
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		const items = devices
			.filter(d => !d.isPrimary)
			.map(d => ({ label: d.deviceId === localId ? `${d.deviceId} (this device)` : d.deviceId, id: d.deviceId }));
		if (items.length === 0) {
			vscode.window.showInformationMessage("No removable companion device found.");
			return;
		}
		const pick = await vscode.window.showQuickPick(items, { placeHolder: "Select companion device to remove" });
		if (!pick) return;
		const r = await vscode.window.showWarningMessage(`Remove device ${pick.id}?`, { modal: true }, "Remove");
		if (r !== "Remove") return;
		const del = await fetch(
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.deviceRemove(encodeURIComponent(pick.id))}`,
			{
				method: "DELETE",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const dj = await del.json();
		if (!del.ok || !dj?.ok) throw new Error(dj?.error || `Failed (${del.status})`);
		vscode.window.showInformationMessage("Device removed");
		await computeAndSetDeviceContexts(context);
	} catch (e) {
		vscode.window.showErrorMessage(`Remove device failed: ${e}`);
	}
}

export async function handleBackfillCompanion(context: vscode.ExtensionContext) {
	await backfillAccessForCompanion(context);
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
		[
			{ label: "Include file name and extension", picked: true },
			{ label: "Include full file context for diff application", value: "full" },
			{ label: "Don't include" },
		],
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

		// Get workspace root directory
		const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";

		if (includeContext?.label?.startsWith("Include")) {
			metadataExtra.filePath = editorFile;
			metadataExtra.fileExt = (editorFile.split(".").pop() || "").toLowerCase();

			// Add project root directory for diff application
			if (workspaceRoot) {
				metadataExtra.projectRoot = workspaceRoot;
				metadataExtra.relativeFilePath = editorFile.replace(workspaceRoot, "").replace(/^[\/\\]/, "");
			}

			// If full context is requested, include line numbers and full file content
			if (includeContext.value === "full") {
				const selection = editor.selection;
				metadataExtra.startLine = selection.start.line + 1; // 1-based line numbers
				metadataExtra.endLine = selection.end.line + 1;
				metadataExtra.fullFileContent = editor.document.getText();
				metadataExtra.isDiffApplicable = true;
			}
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
		const res = await fetch(
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.inviteCreate(encodeURIComponent(teamId))}`,
			{
				// `${base}/protected/teams/${encodeURIComponent(teamId)}/invite`,
				method: "POST",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
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
		const res = await fetch(
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.accept(encodeURIComponent(token))}`,
			// `${base}/protected/teams/invite/${encodeURIComponent(token)}`,
			{
				method: "POST",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
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
		const res = await fetch(
			// `${base}/protected/code-share/${encodeURIComponent(snippetId)}`,
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(snippetId))}`,
			{
				headers: { Authorization: `Bearer ${access}` },
			}
		);
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

export async function handleApplyDiff(context: vscode.ExtensionContext, snippetId?: string) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const id = snippetId ?? (await vscode.window.showInputBox({ prompt: "Enter snippet id" }));
		if (!id) {
			vscode.window.showWarningMessage("No snippet ID provided.");
			return;
		}

		console.log("Applying diff for snippet ID:", id);

		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(id))}`, {
			headers: { Authorization: `Bearer ${access}` },
		});

		console.log("Fetch response status:", res.status);

		if (!res.ok) {
			const errorText = await res.text();
			console.log("Error response:", errorText);
			throw new Error(`Failed to fetch snippet (${res.status}): ${errorText}`);
		}

		const j = await res.json();
		console.log("Snippet metadata:", j?.metadata);

		const text = await tryDecryptSnippet(context, j);
		if (!text) {
			vscode.window.showErrorMessage("Failed to decrypt snippet or snippet not addressed to this device.");
			return;
		}

		const metadata = j?.metadata || {};
		if (!metadata.isDiffApplicable) {
			vscode.window.showWarningMessage("This snippet is not configured for diff application.");
			return;
		}

		// Check if project root matches
		const currentWorkspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
		if (metadata.projectRoot && currentWorkspaceRoot !== metadata.projectRoot) {
			const proceed = await vscode.window.showWarningMessage(
				`Project root mismatch. Snippet was created in "${metadata.projectRoot}" but current workspace is "${currentWorkspaceRoot}". Do you want to proceed anyway?`,
				"Yes",
				"No"
			);
			if (proceed !== "Yes") return;
		}

		// Show diff preview and apply
		await showDiffPreview(context, {
			snippetId: id,
			content: text,
			metadata: metadata,
			originalContent: metadata.fullFileContent || "",
			startLine: metadata.startLine || 1,
			endLine: metadata.endLine || 1,
			filePath: metadata.filePath || "",
			relativeFilePath: metadata.relativeFilePath || "",
		});
	} catch (e) {
		console.error("Apply diff error:", e);
		vscode.window.showErrorMessage(`Apply diff failed: ${e}`);
	}
}

export async function handleRemoveTeamMember(
	context: vscode.ExtensionContext,
	treeProvider: OsmyntTreeProvider,
	item?: { data: { teamId: string; id: string }; label: string }
) {
	try {
		const teamId = item?.data?.teamId as string | undefined;
		const userId = item?.data?.id as string | undefined;
		if (!teamId || !userId) return;
		const confirm = await vscode.window.showWarningMessage(
			`Remove ${item?.label ?? "this member"} from team?`,
			{ modal: true },
			"Remove"
		);
		if (confirm !== "Remove") return;
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(
			// `${base}/protected/teams/${encodeURIComponent(teamId)}/remove-member/${encodeURIComponent(userId)}`,
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.removeTeamMember(encodeURIComponent(teamId), encodeURIComponent(userId))}`,
			{
				method: "DELETE",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const j = await res.json().catch(() => ({}));
		if (!res.ok || !j?.ok) {
			vscode.window.showErrorMessage(j?.error || "Failed to remove member");
			return;
		}
		vscode.window.showInformationMessage("Member removed");
		treeProvider.refresh();
	} catch (e) {
		vscode.window.showErrorMessage(`Failed to remove member: ${String(e)}`);
	}
}
