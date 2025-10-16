"use client";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return <div className="dark">{children}</div>;
}
