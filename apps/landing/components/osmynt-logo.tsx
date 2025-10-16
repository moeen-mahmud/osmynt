export function OsmyntLogo({ height = 21, width = 42 }: { height?: number; width?: number }) {
	return (
		<svg
			aria-label="Osmynt"
			width={width}
			height={height}
			viewBox="0 0 42 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Osmynt</title>
			<rect x="0.272949" y="0.988937" width="30" height="10" rx="2" fill="#39FF14" />
			<rect x="10.4983" y="10.9889" width="30" height="10" rx="2" fill="#F5F5F5" />
		</svg>
	);
}
