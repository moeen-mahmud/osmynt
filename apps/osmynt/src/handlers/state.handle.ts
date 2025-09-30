import type WebSocket from "ws";
import * as vscode from "vscode";

export interface ExtensionState {
	socket?: WebSocket;
	reconnectAttempts: number;
	isInitialized: boolean;
	isConnecting: boolean;
	isLoggedIn: boolean;
}

export class StateHandler {
	private state: ExtensionState = {
		socket: undefined,
		reconnectAttempts: 0,
		isInitialized: false,
		isConnecting: false,
		isLoggedIn: false,
	};

	private readonly eventEmitter = new vscode.EventEmitter();
	public readonly onStateChanged = this.eventEmitter.event;

	public updateState(updates: Partial<ExtensionState>): void {
		this.state = { ...this.state, ...updates };
		this.eventEmitter.fire(this.state);
	}

	public getState(): Readonly<ExtensionState> {
		return { ...this.state };
	}
}
