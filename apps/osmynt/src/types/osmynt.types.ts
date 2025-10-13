export type OsmyntNodeKind = "team" | "membersRoot" | "member" | "recentRoot" | "action";

export type ShareTarget = { kind: "team"; teamId?: string } | { kind: "user"; userId: string };

export type DeviceState =
	| { kind: "unpaired" }
	| { kind: "registeredPrimary"; deviceId: string }
	| { kind: "registeredCompanion"; deviceId: string }
	| { kind: "removed" };

export * from "./api.types";
