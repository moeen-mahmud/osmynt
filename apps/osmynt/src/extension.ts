import * as vscode from "vscode";
import { ACCESS_SECRET_KEY, DEVICE_ID_KEY, REALTIME_CHANNEL, SNIPPET_CREATED_EVENT } from "@/constants/osmynt.constant";
import { OsmyntTreeProvider } from "@/provider/osmynt.provider";
import { ensureDeviceKeys, tryDecryptSnippet, computeAndSetDeviceContexts } from "@/services/osmynt.services";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import {
	handleLogin,
	handleLogout,
	handleShareCode,
	handleInviteMember,
	handleAcceptInvitation,
	handleRefreshEntry,
	handleViewSnippet,
	handleRemoveTeamMember,
	handleAddDevicePrimary,
	handleAddDeviceCompanion,
	handleRemoveDevice,
	handleBackfillCompanion,
	handleApplyDiff,
	handleListDevices,
	handleRepairDevice,
	handleForceRemoveDevice,
	handleClearLocalCache,
} from "@/commands/osmynt.commands";

import { getBaseAndAccess } from "@/services/osmynt.services";
import Redis from "ioredis";
import { ENV } from "@/config/env.config";

export async function activate(context: vscode.ExtensionContext) {
	const tree = new OsmyntTreeProvider(context);
	context.subscriptions.push(vscode.window.registerTreeDataProvider("osmyntView", tree));
	treeProvider = tree;

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.login", () => handleLogin(context, tree, connectRealtime)),
		vscode.commands.registerCommand("osmynt.logout", () =>
			handleLogout(context, tree, () => disconnectRealtime(context))
		),
		vscode.commands.registerCommand("osmynt.shareCode", () => handleShareCode(context, tree)),
		vscode.commands.registerCommand("osmynt.inviteMember", () => handleInviteMember(context)),
		vscode.commands.registerCommand("osmynt.acceptInvitation", () => handleAcceptInvitation(context, tree)),
		vscode.commands.registerCommand("osmynt.refreshEntry", () => handleRefreshEntry(tree)),
		vscode.commands.registerCommand("osmynt.viewSnippet", (id?: string) => handleViewSnippet(context, id)),
		vscode.commands.registerCommand("osmynt.removeTeamMember", async (item?: any) =>
			handleRemoveTeamMember(context, tree, item)
		),
		vscode.commands.registerCommand("osmynt.addDevicePrimary", () => handleAddDevicePrimary(context)),
		vscode.commands.registerCommand("osmynt.addDeviceCompanion", () => handleAddDeviceCompanion(context)),
		vscode.commands.registerCommand("osmynt.removeDevice", () => handleRemoveDevice(context)),
		vscode.commands.registerCommand("osmynt.backfillCompanion", () => handleBackfillCompanion(context)),
		vscode.commands.registerCommand("osmynt.listDevices", () => handleListDevices(context)),
		vscode.commands.registerCommand("osmynt.repairDevice", () => handleRepairDevice(context)),
		vscode.commands.registerCommand("osmynt.forceRemoveDevice", () => handleForceRemoveDevice(context)),
		vscode.commands.registerCommand("osmynt.clearLocalCache", () => handleClearLocalCache(context)),
		vscode.commands.registerCommand("osmynt.snippet.copy", async (item?: any) => {
			if (!item?.data?.id) return;
			const { base, access } = await getBaseAndAccess(context);
			const res = await fetch(
				`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(item.data.id))}`,
				{
					headers: { Authorization: `Bearer ${access}` },
				}
			);
			const j = await res.json();
			const text = await tryDecryptSnippet(context, j);
			if (text) await vscode.env.clipboard.writeText(text);
			vscode.window.showInformationMessage("Code blocks copied to clipboard");
		}),
		vscode.commands.registerCommand("osmynt.snippet.openToSide", async (item?: any) => {
			await vscode.commands.executeCommand("osmynt.viewSnippet", item?.data?.id);
			await vscode.commands.executeCommand("workbench.action.moveEditorToNextGroup");
		}),
		vscode.commands.registerCommand("osmynt.snippet.insertAtCursor", async (item?: any) => {
			if (!item?.data?.id) return;
			const { base, access } = await getBaseAndAccess(context);
			const res = await fetch(
				`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(item.data.id))}`,
				{
					headers: { Authorization: `Bearer ${access}` },
				}
			);
			const j = await res.json();
			const text = await tryDecryptSnippet(context, j);
			const editor = vscode.window.activeTextEditor;
			if (text && editor) editor.edit(b => b.insert(editor.selection.active, text));
		}),
		vscode.commands.registerCommand("osmynt.filterRecentsByMember", async (item?: any) => {
			if (!item?.data?.id || !item?.data?.teamId) return;
			await context.globalState.update(`osmynt.filter.${item.data.teamId}`, item.data.id);
			await vscode.commands.executeCommand("setContext", `osmynt.filter.${item.data.teamId}`, item.data.id);
			treeProvider?.refresh();
		}),
		vscode.commands.registerCommand("osmynt.clearRecentsFilter", async (item?: any) => {
			const teamId = item?.data?.id || item?.data?.teamId;
			if (!teamId) return;
			await context.globalState.update(`osmynt.filter.${teamId}`, undefined);
			await vscode.commands.executeCommand("setContext", `osmynt.filter.${teamId}`, undefined);
			treeProvider?.refresh();
		}),
		vscode.commands.registerCommand("osmynt.applyDiff", (item?: any) => {
			console.log("Apply diff command called with item:", item);
			const snippetId = item?.data?.id;
			console.log("Extracted snippet ID:", snippetId);
			handleApplyDiff(context, snippetId);
		})
	);

	// Set Contexts
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", Boolean(access));
	await vscode.commands.executeCommand("setContext", "osmynt.isPrimaryDevice", false);
	await vscode.commands.executeCommand("setContext", "osmynt.isCompanionDevice", false);
	await vscode.commands.executeCommand("setContext", "osmynt.canGeneratePairing", false);
	await vscode.commands.executeCommand("setContext", "osmynt.canPastePairing", false);
	await vscode.commands.executeCommand("setContext", "osmynt.isRegisteredDevice", false);

	await initializeBackgroundServices(context, tree);
}

export function deactivate() {
	disconnectRealtime();
}

let treeProvider: OsmyntTreeProvider | null = null;
let redisSubscriber: Redis | null = null;

async function initializeBackgroundServices(context: vscode.ExtensionContext, tree: OsmyntTreeProvider) {
	const access = await context.secrets.get(ACCESS_SECRET_KEY);

	if (access) {
		try {
			await ensureDeviceKeys(context);
		} catch (error) {
			console.log("Failed to ensure device keys:", error);
		}

		try {
			await computeAndSetDeviceContexts(context);
		} catch (error) {
			console.log("Failed to compute device contexts:", error);
		}

		try {
			if (!redisSubscriber) {
				await connectRealtime(context, tree);
			}
		} catch (error) {
			console.log("Failed to connect to realtime:", error);
		}
	}
}

export async function connectRealtime(_context: vscode.ExtensionContext, treeProvider: OsmyntTreeProvider) {
	if (redisSubscriber) return;

	const url = ENV.upstashRedisUrl;
	if (!url) {
		vscode.window.showWarningMessage("Error connecting to realtime. Please set UPSTASH_REDIS_URL.");
		return;
	}
	redisSubscriber = new Redis(url);
	await new Promise<void>((resolve, reject) => {
		redisSubscriber!.subscribe(REALTIME_CHANNEL, err => {
			if (err) reject(err);
			else resolve();
		});
	});
	redisSubscriber.on("message", async (channel: string, message: string) => {
		if (channel !== REALTIME_CHANNEL) return;
		let payload: any;
		try {
			payload = JSON.parse(message);
		} catch {
			return;
		}
		const event = payload?.event as string | undefined;
		const data = payload?.payload;
		if (!event) return;
		if (event === SNIPPET_CREATED_EVENT) {
			try {
				const { base, access } = await getBaseAndAccess(_context);
				const id = data?.id as string | undefined;
				if (id) {
					// Short-circuit: if this device is no longer registered, ignore notification
					try {
						const localDeviceId = await _context.secrets.get(DEVICE_ID_KEY);
						const deviceResponse = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
							headers: { Authorization: `Bearer ${access}` },
						});
						const deviceData: any = await deviceResponse.json();
						const isRegistered = Array.isArray(deviceData?.devices)
							? (deviceData.devices as any[]).some(d => d?.deviceId === localDeviceId)
							: false;
						if (!isRegistered) return;
					} catch {}
					const res = await fetch(
						`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(id))}`,
						{
							headers: { Authorization: `Bearer ${access}` },
						}
					);
					const snippetResponse: any = await res.json();
					const canDecrypt = (await tryDecryptSnippet(_context, snippetResponse)) !== null;
					const title =
						(data?.title as string | undefined) ||
						(snippetResponse?.metadata?.title as string | undefined) ||
						"Code blocks";
					const authorName = (data?.authorName as string | undefined) || snippetResponse?.authorName;
					const firstRecipientName = data?.firstRecipientName as string | undefined;
					const authorId = (data?.authorId as string | undefined) || snippetResponse?.authorId;
					let currentUserId: string | undefined;

					try {
						const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
							headers: { Authorization: `Bearer ${access}` },
						});
						const me: any = await meRes.json();
						currentUserId = me?.user?.id as string | undefined;
					} catch {}

					const localDeviceForWrap = await _context.secrets.get(DEVICE_ID_KEY);
					const wraps: any[] = Array.isArray(snippetResponse?.wrappedKeys)
						? (snippetResponse.wrappedKeys as any[])
						: [];
					const addressedToThisDevice = localDeviceForWrap
						? wraps.some(w => w?.recipientDeviceId === localDeviceForWrap)
						: false;
					const addressedToUser = currentUserId
						? wraps.some(w => w?.recipientUserId === currentUserId)
						: false;
					if (authorId !== currentUserId && (canDecrypt || addressedToThisDevice || addressedToUser)) {
						// Receiver toast
						vscode.window.showInformationMessage(
							// `A new blocks |${title}| arrived from "${authorName ?? "someone"}"`
							`${authorName ?? "someone"} : ${title}`
						);
						treeProvider.refresh();
					} else if (currentUserId && authorId === currentUserId) {
						// Sender toast
						vscode.window.showInformationMessage(
							// `Code blocks |${title}| shared to ${firstRecipientName ?? data?.teamName ?? "team"}`
							`${title} : ${firstRecipientName ?? data?.teamName ?? "team"}`
						);
						treeProvider.refresh();
					}
				}
				// Refresh both sides
				treeProvider.refresh();
			} catch {}
		}
		if (event === "keys:changed") {
			try {
				await computeAndSetDeviceContexts(_context);
				treeProvider.refresh();
			} catch {}
		}
		if (event === "team:memberJoined") {
			try {
				treeProvider.refresh();
			} catch {}
		}
	});
}

export async function disconnectRealtime(_context?: vscode.ExtensionContext) {
	try {
		await redisSubscriber?.quit();
	} catch {}
	redisSubscriber = null;
}

// triggering release
