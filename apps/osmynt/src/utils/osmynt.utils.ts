export function b64url(bytes: Uint8Array) {
	return Buffer.from(bytes).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function b64uToBytes(s: string) {
	const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
	return Uint8Array.from(Buffer.from(padded, "base64"));
}

export function extractInviteToken(input: string): string | undefined {
	try {
		// If it's a URL with ?token= param
		if (input.includes("http")) {
			const u = new URL(input);
			const t = u.searchParams.get("token");
			if (t) return t;
			// Or path /invite/:token
			const parts = u.pathname.split("/").filter(Boolean);
			const idx = parts.findIndex(p => p === "invite");
			if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
		}
		return input.trim();
	} catch {
		return input.trim();
	}
}
