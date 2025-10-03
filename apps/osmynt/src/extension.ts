import * as vscode from "vscode";
import { ACCESS_SECRET_KEY } from "@/constants/constants";
import { OsmyntTreeProvider } from "@/provider/osmynt.provider";
import { ensureDeviceKeys, tryDecryptSnippet } from "@/services/osmynt.services";
import {
	handleLogin,
	handleLogout,
	handleShareCode,
	handleInviteMember,
	handleAcceptInvitation,
	handleRefreshTeam,
	handleViewSnippet,
} from "@/commands/osmynt.commands";
import { getBaseAndAccess } from "@/services/osmynt.services";
import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";

let treeProvider: OsmyntTreeProvider | null = null;

export async function activate(context: vscode.ExtensionContext) {
	const tree = new OsmyntTreeProvider(context);
	context.subscriptions.push(vscode.window.registerTreeDataProvider("osmyntView", tree));
	treeProvider = tree;

	context.subscriptions.push(
		vscode.commands.registerCommand("osmynt.login", () => handleLogin(context, tree, connectRealtime)),
		vscode.commands.registerCommand("osmynt.logout", () => handleLogout(context, tree, disconnectRealtime)),
		vscode.commands.registerCommand("osmynt.shareCode", () => handleShareCode(context)),
		vscode.commands.registerCommand("osmynt.inviteMember", () => handleInviteMember(context)),
		vscode.commands.registerCommand("osmynt.acceptInvitation", () => handleAcceptInvitation(context)),
		vscode.commands.registerCommand("osmynt.refreshTeam", () => handleRefreshTeam(tree)),
		vscode.commands.registerCommand("osmynt.viewSnippet", (id?: string) => handleViewSnippet(context, id)),
		vscode.commands.registerCommand("osmynt.snippet.copy", async (item?: any) => {
			if (!item?.data?.id) return;
			const { base, access } = await getBaseAndAccess(context);
			const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(item.data.id)}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
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
			const res = await fetch(`${base}/protected/code-share/${encodeURIComponent(item.data.id)}`, {
				headers: { Authorization: `Bearer ${access}` },
			});
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
		})
	);

	const access = await context.secrets.get(ACCESS_SECRET_KEY);
	await vscode.commands.executeCommand("setContext", "osmynt.isLoggedIn", Boolean(access));
	if (access) {
		try {
			await ensureDeviceKeys(context);
		} catch {
			// vscode.window.showErrorMessage("Failed to ensure device keys");
		}
		try {
			if (!realtimeChannel) {
				await connectRealtime(context, tree);
			}
		} catch {}
	}
}

export function deactivate() {}

let realtimeChannel: RealtimeChannel | null = null;
let supabaseClient: SupabaseClient | null = null;

export async function connectRealtime(_context: vscode.ExtensionContext, treeProvider: OsmyntTreeProvider) {
	if (realtimeChannel) return; // already connected
	const cfg = vscode.workspace.getConfiguration("osmynt");
	const url = cfg.get<string>("supabaseUrl");
	const anonKey = cfg.get<string>("supabaseAnonKey");
	if (!url || !anonKey) {
		vscode.window.showWarningMessage("Error connecting to realtime. Please check your configuration.");
		return;
	}
	supabaseClient = createClient(url, anonKey, { realtime: { params: { eventsPerSecond: 3 } } });
	const channel = supabaseClient.channel("osmynt-recent-snippets");
	realtimeChannel = channel
		.on("broadcast", { event: "snippet:created" }, async _payload => {
			try {
				vscode.window.showInformationMessage(`Snippet ${_payload.payload.title} received!`);
				treeProvider?.refresh();
			} catch {}
		})
		.subscribe();
}

export async function disconnectRealtime(_context: vscode.ExtensionContext) {
	try {
		await realtimeChannel?.unsubscribe();
	} catch {}
	try {
		await supabaseClient?.removeAllChannels();
	} catch {}
	realtimeChannel = null;
	supabaseClient = null;
}
