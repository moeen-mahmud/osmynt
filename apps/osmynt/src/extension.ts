import * as vscode from "vscode";
import { ACCESS_SECRET_KEY, DEVICE_ID_KEY } from "@/constants/osmynt.constant";
import { OsmyntTreeProvider } from "@/provider/osmynt.provider";
import { ensureDeviceKeys, tryDecryptSnippet, computeAndSetDeviceContexts } from "@/services/osmynt.services";
import { ENDPOINTS } from "@/constants/endpoints.constant";
import {
	handleLogin,
	handleLogout,
	handleShareCode,
	handleInviteMember,
	handleAcceptInvitation,
	handleRefreshTeam,
	handleViewSnippet,
	handleRemoveTeamMember,
	handleAddDevicePrimary,
	handleAddDeviceCompanion,
	handleRemoveDevice,
	handleBackfillCompanion,
	handleApplyDiff,
} from "@/commands/osmynt.commands";

import { getBaseAndAccess, applyAllChanges, showSideBySideView } from "@/services/osmynt.services";
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
		vscode.commands.registerCommand("osmynt.refreshTeam", () => handleRefreshTeam(tree)),
		vscode.commands.registerCommand("osmynt.viewSnippet", (id?: string) => handleViewSnippet(context, id)),
		vscode.commands.registerCommand("osmynt.removeTeamMember", async (item?: any) =>
			handleRemoveTeamMember(context, tree, item)
		),
		vscode.commands.registerCommand("osmynt.addDevicePrimary", () => handleAddDevicePrimary(context)),
		vscode.commands.registerCommand("osmynt.addDeviceCompanion", () => handleAddDeviceCompanion(context)),
		vscode.commands.registerCommand("osmynt.removeDevice", () => handleRemoveDevice(context)),
		vscode.commands.registerCommand("osmynt.backfillCompanion", () => handleBackfillCompanion(context)),
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
			vscode.window.showInformationMessage("Snippet copied to clipboard");
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
		}),
		// Diff commands
		vscode.commands.registerCommand("osmynt.diff.acceptAll", async () => {
			const diffData = (await context.globalState.get("osmynt.currentDiffData")) as any;
			if (!diffData) {
				vscode.window.showWarningMessage("No active diff session found.");
				return;
			}
			await applyAllChanges(diffData);
			vscode.window.showInformationMessage("✅ All changes accepted and applied!");
		}),
		vscode.commands.registerCommand("osmynt.diff.rejectAll", async () => {
			vscode.window.showInformationMessage("❌ Changes rejected!");
		}),
		vscode.commands.registerCommand("osmynt.diff.acceptCurrent", async () => {
			const diffData = (await context.globalState.get("osmynt.currentDiffData")) as any;
			if (!diffData) {
				vscode.window.showWarningMessage("No active diff session found.");
				return;
			}
			await applyAllChanges(diffData);
			vscode.window.showInformationMessage("✅ Current change accepted!");
		}),
		vscode.commands.registerCommand("osmynt.diff.applyAndStage", async () => {
			const diffData = (await context.globalState.get("osmynt.currentDiffData")) as any;
			if (!diffData) {
				vscode.window.showWarningMessage("No active diff session found.");
				return;
			}
			await applyAllChanges(diffData);
			try {
				await vscode.commands.executeCommand("git.stage", diffData.filePath);
				vscode.window.showInformationMessage("✅ Changes applied and staged successfully!");
			} catch {
				vscode.window.showWarningMessage("Changes applied but staging failed. You can stage manually.");
			}
		}),
		vscode.commands.registerCommand("osmynt.diff.showSideBySide", async () => {
			const diffData = (await context.globalState.get("osmynt.currentDiffData")) as any;
			if (!diffData) {
				vscode.window.showWarningMessage("No active diff session found.");
				return;
			}
			await showSideBySideView(diffData);
		}),
		vscode.commands.registerCommand("osmynt.diff.toggleInline", async () => {
			vscode.window.showInformationMessage("Inline view toggle not implemented yet.");
		})
	);

	// Initialize contexts
	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", Boolean(access));
	// Prime contexts to false until computed
	await vscode.commands.executeCommand("setContext", "osmynt.isPrimaryDevice", false);
	await vscode.commands.executeCommand("setContext", "osmynt.isCompanionDevice", false);
	await vscode.commands.executeCommand("setContext", "osmynt.canGeneratePairing", false);
	await vscode.commands.executeCommand("setContext", "osmynt.canPastePairing", false);
	await vscode.commands.executeCommand("setContext", "osmynt.isRegisteredDevice", false);

	// Automatic login and background setup
	await initializeBackgroundServices(context, tree);
}

export function deactivate() {
	// Clean up realtime connection on deactivation
	disconnectRealtime();
}

let treeProvider: OsmyntTreeProvider | null = null;
let redisSubscriber: Redis | null = null;

/**
 * Initialize background services for automatic login and notifications
 */
async function initializeBackgroundServices(context: vscode.ExtensionContext, tree: OsmyntTreeProvider) {
	const access = await context.secrets.get(ACCESS_SECRET_KEY);

	if (access) {
		// User is already logged in, set up background services
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
	if (redisSubscriber) return; // already connected
	const url = ENV.upstashRedisUrl;
	if (!url) {
		vscode.window.showWarningMessage("Error connecting to realtime. Please set UPSTASH_REDIS_URL.");
		return;
	}
	redisSubscriber = new Redis(url);
	await new Promise<void>((resolve, reject) => {
		redisSubscriber!.subscribe("osmynt-recent-snippets", err => {
			if (err) reject(err);
			else resolve();
		});
	});
	redisSubscriber.on("message", async (channel: string, message: string) => {
		if (channel !== "osmynt-recent-snippets") return;
		let payload: any;
		try {
			payload = JSON.parse(message);
		} catch {
			return;
		}
		const event = payload?.event as string | undefined;
		const data = payload?.payload;
		if (!event) return;
		if (event === "snippet:created") {
			try {
				const { base, access } = await getBaseAndAccess(_context);
				const id = data?.id as string | undefined;
				if (id) {
					// Short-circuit: if this device is no longer registered, ignore notification
					try {
						const localDeviceId = await _context.secrets.get(DEVICE_ID_KEY);
						const dres = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.keys.me}`, {
							headers: { Authorization: `Bearer ${access}` },
						});
						const dj = await dres.json();
						const isRegistered = Array.isArray(dj?.devices)
							? (dj.devices as any[]).some(d => d?.deviceId === localDeviceId)
							: false;
						if (!isRegistered) return;
					} catch {}
					const res = await fetch(
						`${base}/${ENDPOINTS.base}/${ENDPOINTS.codeShare.getById(encodeURIComponent(id))}`,
						{
							headers: { Authorization: `Bearer ${access}` },
						}
					);
					const j = await res.json();
					const canDecrypt = (await tryDecryptSnippet(_context, j)) !== null;
					const title =
						(data?.title as string | undefined) || (j?.metadata?.title as string | undefined) || "Snippet";
					const authorName = (data?.authorName as string | undefined) || j?.authorName;
					const firstRecipientName = data?.firstRecipientName as string | undefined;
					const authorId = (data?.authorId as string | undefined) || j?.authorId;
					let currentUserId: string | undefined;

					try {
						const meRes = await fetch(`${base}/${ENDPOINTS.base}/${ENDPOINTS.teams.me}`, {
							headers: { Authorization: `Bearer ${access}` },
						});
						const me = await meRes.json();
						currentUserId = me?.user?.id as string | undefined;
					} catch {}

					const localDeviceForWrap = await _context.secrets.get(DEVICE_ID_KEY);
					const wraps: any[] = Array.isArray(j?.wrappedKeys) ? (j.wrappedKeys as any[]) : [];
					const addressedToThisDevice = localDeviceForWrap
						? wraps.some(w => w?.recipientDeviceId === localDeviceForWrap)
						: false;
					const addressedToUser = currentUserId
						? wraps.some(w => w?.recipientUserId === currentUserId)
						: false;
					if (authorId !== currentUserId && (canDecrypt || addressedToThisDevice || addressedToUser)) {
						// Receiver toast
						vscode.window.showInformationMessage(
							`A NEW SNIPPET ${title} ARRIVED FROM ${authorName ?? "someone"}`
						);
						treeProvider.refresh();
					} else if (currentUserId && authorId === currentUserId) {
						// Sender toast
						vscode.window.showInformationMessage(
							`SNIPPET ${title} SHARED TO ${firstRecipientName ?? data?.teamName ?? "team"}`
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
