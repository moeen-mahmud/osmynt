import { ACCESS_SECRET_KEY, DEVICE_ID_KEY, LANGUAGE_BY_EXT, REFRESH_SECRET_KEY } from "@/constants/osmynt.constant";
import type { OsmyntTreeProvider } from "@/provider/osmynt.provider";
import type { KeysMeResponse, CodeShareGetByIdResponse, DeviceKeySummary, ApiError } from "@/types/osmynt.types";
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
	clearLocalDeviceSecrets,
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
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const response: KeysMeResponse = await res.json();
		const devices: DeviceKeySummary[] = Array.isArray(response?.devices) ? response.devices : [];

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

		const removed = await vscode.window.showWarningMessage(`Remove device ${pick.id}?`, { modal: true }, "Remove");
		if (removed !== "Remove") return;
		const deleteResponse = await fetch(
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.deviceRemove(encodeURIComponent(pick.id))}`,
			{
				method: "DELETE",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const deleteResponseData: any = await deleteResponse.json();
		if (!deleteResponse.ok || !deleteResponseData?.ok) {
			throw new Error(deleteResponseData?.error || `Failed (${deleteResponse.status})`);
		}
		vscode.window.showInformationMessage("Device removed");
		await computeAndSetDeviceContexts(context);
	} catch (e) {
		vscode.window.showErrorMessage(`Remove device failed: ${e}`);
	}
}

export async function handleBackfillCompanion(context: vscode.ExtensionContext) {
	await backfillAccessForCompanion(context);
}

export async function handleListDevices(context: vscode.ExtensionContext) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const keysResponse: KeysMeResponse = await res.json();
		const devices: DeviceKeySummary[] = Array.isArray(keysResponse?.devices) ? keysResponse.devices : [];
		const localId = await context.secrets.get(DEVICE_ID_KEY);

		if (devices.length === 0) {
			vscode.window.showInformationMessage("No registered devices found.");
			return;
		}

		// Create a detailed device list
		const deviceList = devices.map((device, index) => {
			const isLocal = device.deviceId === localId;
			const isPrimary = index === 0 || device.isPrimary;
			const status = isLocal ? " (this device)" : "";
			const role = isPrimary ? "PRIMARY" : "Companion";
			const localStatus = isLocal ? " • LOCAL" : "";

			return `${role}${localStatus}${status}: ${device.deviceId}`;
		});

		// const message = `Registered Devices (${devices.length}):\n\n${deviceList.join("\n")}`;
		const message = `Registered Devices (${devices.length})`;

		// Show in a more detailed way
		const action = await vscode.window.showInformationMessage(
			message,
			{
				modal: true,
				detail: deviceList.join("\n"),
			},
			"Remove Device",
			"Repair This Device",
			"Close"
		);

		if (action === "Remove Device") {
			await handleRemoveDevice(context);
		} else if (action === "Repair This Device") {
			await handleRepairDevice(context);
		}
	} catch (e) {
		vscode.window.showErrorMessage(`List devices failed: ${e}`);
	}
}

export async function handleRepairDevice(context: vscode.ExtensionContext) {
	try {
		const localId = await context.secrets.get(DEVICE_ID_KEY);
		if (!localId) {
			vscode.window.showWarningMessage("No local device ID found. Please re-register this device.");
			return;
		}

		const { base, access } = await getBaseAndAccess(context);

		// Check if device is registered on server
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const keysResponse: KeysMeResponse = await res.json();
		const devices: DeviceKeySummary[] = Array.isArray(keysResponse?.devices) ? keysResponse.devices : [];
		const isRegistered = devices.some(d => d.deviceId === localId);

		if (isRegistered) {
			vscode.window.showInformationMessage("This device is already registered on the server. No repair needed.");
			return;
		}

		// Device is not registered, offer to re-register
		const action = await vscode.window.showWarningMessage(
			"This device is not registered on the server. This can happen after clearing extension cache. Would you like to re-register this device?",
			{ modal: true },
			"Re-register Device"
			// "Cancel"
		);

		if (action === "Re-register Device") {
			// Clear local secrets and re-register
			await clearLocalDeviceSecrets(context);
			await ensureDeviceKeys(context);
			await computeAndSetDeviceContexts(context);
			vscode.window.showInformationMessage("Device re-registered successfully!");
		}
	} catch (e) {
		vscode.window.showErrorMessage(`Repair device failed: ${e}`);
	}
}

export async function handleForceRemoveDevice(context: vscode.ExtensionContext) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
			headers: { Authorization: `Bearer ${access}` },
		});
		const keysResponse: KeysMeResponse = await res.json();
		const devices: DeviceKeySummary[] = Array.isArray(keysResponse?.devices) ? keysResponse.devices : [];
		const localId = await context.secrets.get(DEVICE_ID_KEY);

		if (devices.length === 0) {
			vscode.window.showInformationMessage("No devices to remove.");
			return;
		}

		// Create device list with force remove options
		const items = devices.map((device, index) => {
			const isLocal = device.deviceId === localId;
			const isPrimary = index === 0 || device.isPrimary;
			const role = isPrimary ? "PRIMARY" : "Companion";
			const localStatus = isLocal ? " (this device)" : "";

			return {
				label: `${role}${localStatus}: ${device.deviceId}`,
				id: device.deviceId,
				description: isPrimary ? "⚠️ Primary device - removing will require re-registration" : "Safe to remove",
			};
		});

		const pick = await vscode.window.showQuickPick(items, {
			placeHolder: "Select device to force remove (including primary devices)",
			ignoreFocusOut: true,
		});

		if (!pick) return;

		const isPrimary = pick.description?.includes("Primary");
		const isLocal = pick.label.includes("this device");

		let confirmMessage = `Remove device ${pick.id}?`;
		if (isPrimary) {
			confirmMessage = `⚠️ WARNING: This is a PRIMARY device. Removing it will require re-registration and may cause data access issues. Continue?`;
		}
		if (isLocal) {
			confirmMessage += `\n\nThis will remove the current device and clear local keys.`;
		}

		const confirm = await vscode.window.showWarningMessage(
			confirmMessage,
			{ modal: true },
			"Force Remove"
			// "Cancel"
		);

		if (confirm !== "Force Remove") return;

		// Force remove the device
		const del = await fetch(
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.deviceForceRemove(encodeURIComponent(pick.id))}`,
			{
				method: "DELETE",
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const dj: any = await del.json();
		if (!del.ok || !dj?.ok) throw new Error(dj?.error || `Failed (${del.status})`);

		// If we removed the local device, clear local secrets
		if (isLocal) {
			await clearLocalDeviceSecrets(context);
			vscode.window.showInformationMessage(
				"Device removed and local keys cleared. Please re-register this device."
			);
		} else {
			vscode.window.showInformationMessage("Device removed successfully.");
		}

		await computeAndSetDeviceContexts(context);
	} catch (e) {
		vscode.window.showErrorMessage(`Force remove device failed: ${e}`);
	}
}

export async function handleClearLocalCache(context: vscode.ExtensionContext) {
	try {
		const action = await vscode.window.showWarningMessage(
			"This will clear all local device keys and require re-registration. This is useful when you're getting 'device removed' errors after clearing browser cache. Continue?",
			{ modal: true },
			"Clear Cache"
			// "Cancel"
		);

		if (action !== "Clear Cache") return;

		// Clear all local device secrets
		await clearLocalDeviceSecrets(context);

		// Reset device contexts
		await vscode.commands.executeCommand("setContext", "osmynt.isRegisteredDevice", false);
		await vscode.commands.executeCommand("setContext", "osmynt.isPrimaryDevice", false);
		await vscode.commands.executeCommand("setContext", "osmynt.isCompanionDevice", false);
		await vscode.commands.executeCommand("setContext", "osmynt.canGeneratePairing", false);
		await vscode.commands.executeCommand("setContext", "osmynt.canPastePairing", false);

		vscode.window
			.showInformationMessage(
				"Local cache cleared.",
				{
					modal: true,
					detail: "Please use 'Add Device (Primary)' or 'Add Device (Companion)' to re-register this device.",
				},
				"Add Primary Device",
				"Add Companion Device"
			)
			.then(selection => {
				if (selection === "Add Primary Device") {
					vscode.commands.executeCommand("osmynt.addDevicePrimary");
				} else if (selection === "Add Companion Device") {
					vscode.commands.executeCommand("osmynt.addDeviceCompanion");
				}
			});
	} catch (e) {
		vscode.window.showErrorMessage(`Clear cache failed: ${e}`);
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
		vscode.window.showWarningMessage("Select some code blocks to share.");
		return;
	}
	const selected = editor.document.getText(editor.selection);
	const includeContext = await vscode.window.showQuickPick(
		[
			{ label: "Include file name and extension", picked: true },
			{ label: "Include full file context for diff application", value: "full" },
			{ label: "Don't include" },
		],
		{ canPickMany: false, placeHolder: "Include file context in code blocks metadata?" }
	);
	const title = await vscode.window.showInputBox({ prompt: "Code blocks title (required)" });
	if (!title || title.trim().length === 0) {
		vscode.window.showWarningMessage("Code blocks title is required.");
		return;
	}

	const target = await pickShareTarget(context);
	vscode.window.showInformationMessage("Sharing code blocks...");
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
				metadataExtra.relativeFilePath = editorFile.replace(workspaceRoot, "").replace(/^[/\\]/, "");
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
		vscode.window.showInformationMessage("Osmynt: Code blocks shared securely");
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
		const j: any = await res.json();
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
		const j: any = await res.json();
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

export async function handleViewSnippet(context: vscode.ExtensionContext, id?: string) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const snippetId = id ?? (await vscode.window.showInputBox({ prompt: "Enter code blocks id" }));
		if (!snippetId) return;
		const res = await fetch(
			// `${base}/protected/code-share/${encodeURIComponent(snippetId)}`,
			`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(snippetId))}`,
			{
				headers: { Authorization: `Bearer ${access}` },
			}
		);
		const j: CodeShareGetByIdResponse | ApiError = await res.json();
		if (!res.ok) throw new Error((j as ApiError)?.error || `Failed (${res.status})`);
		const text = await tryDecryptSnippet(context, j as CodeShareGetByIdResponse);
		const fileExt = ((j as CodeShareGetByIdResponse)?.metadata?.fileExt as string | undefined)?.toLowerCase();
		const languageByExt: Record<string, string> = LANGUAGE_BY_EXT;
		const language = (fileExt && languageByExt[fileExt]) || "plaintext";
		const doc = await vscode.workspace.openTextDocument({
			language,
			content: text ?? "[Encrypted code blocks opened. Decrypt failed or not addressed to this device.]",
		});
		await vscode.window.showTextDocument(doc, { preview: false });
	} catch (e) {
		vscode.window.showErrorMessage(`Open failed: ${e}`);
	}
}

export async function handleApplyDiff(context: vscode.ExtensionContext, snippetId?: string) {
	try {
		const { base, access } = await getBaseAndAccess(context);
		const id = snippetId ?? (await vscode.window.showInputBox({ prompt: "Enter code blocks id" }));
		if (!id) {
			vscode.window.showWarningMessage("No code blocks ID provided.");
			return;
		}

		console.log("Applying diff for code blocks ID:", id);

		const res = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(id))}`, {
			headers: { Authorization: `Bearer ${access}` },
		});

		console.log("Fetch response status:", res.status);

		if (!res.ok) {
			const errorText = await res.text();
			console.log("Error response:", errorText);
			throw new Error(`Failed to fetch code blocks (${res.status}): ${errorText}`);
		}

		const response: CodeShareGetByIdResponse | ApiError = await res.json();
		console.log("Code blocks metadata:", (response as CodeShareGetByIdResponse)?.metadata);

		const text = await tryDecryptSnippet(context, response as CodeShareGetByIdResponse);
		if (!text) {
			vscode.window.showErrorMessage(
				"Failed to decrypt code blocks or code blocks not addressed to this device."
			);
			return;
		}

		const metadata = (response as CodeShareGetByIdResponse)?.metadata;
		if (!metadata?.isDiffApplicable) {
			vscode.window.showWarningMessage("This code blocks is not configured for diff application.", {
				modal: true,
			});
			return;
		}

		// Check if project root matches
		const currentWorkspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
		if (metadata?.projectRoot && currentWorkspaceRoot !== metadata.projectRoot) {
			const proceed = await vscode.window.showWarningMessage(
				`Project root mismatch. Code blocks was created in "${metadata.projectRoot}" but current workspace is "${currentWorkspaceRoot}". Do you want to proceed anyway?`,
				{ modal: true },
				"Yes",
				"No"
			);
			if (proceed !== "Yes") return;
		}

		// Show diff preview and apply
		await showDiffPreview(context, {
			snippetId: id,
			content: text,
			metadata: metadata || {},
			originalContent: metadata?.fullFileContent || "",
			startLine: metadata?.startLine || 1,
			endLine: metadata?.endLine || 1,
			filePath: metadata?.filePath || "",
			relativeFilePath: metadata?.relativeFilePath || "",
		});
	} catch (e) {
		console.error("Apply diff error:", e);
		vscode.window.showErrorMessage(`Apply diff failed: ${e}`);
	}
}

export async function handleRefreshEntry(treeProvider: OsmyntTreeProvider) {
	try {
		await vscode.commands.executeCommand("workbench.view.extension.osmynt");
		treeProvider?.refresh();
	} catch {}
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
		const response: any = await res.json().catch(() => ({}));
		if (!res.ok || !response?.ok) {
			vscode.window.showErrorMessage(response?.error || "Failed to remove member");
			return;
		}
		vscode.window.showInformationMessage("Member removed");
		treeProvider.refresh();
	} catch (e) {
		vscode.window.showErrorMessage(`Failed to remove member: ${String(e)}`);
	}
}
