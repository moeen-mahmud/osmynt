export type OsmyntNodeKind = "team" | "membersRoot" | "member" | "recentRoot" | "action";

export type ShareTarget = { kind: "team"; teamId?: string } | { kind: "user"; userId: string };
