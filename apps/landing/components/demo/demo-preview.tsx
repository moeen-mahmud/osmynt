import { Button } from "@/components/ui/button";
import { Play, AlertCircle } from "lucide-react";

export const DemoPreview: React.FC<{ setShowDemo: (show: boolean) => void }> = ({ setShowDemo }) => {
	return (
		<div className="relative rounded-lg border border-border bg-card p-6 max-w-7xl mx-auto">
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="mb-8">
					<div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
						<Play className="h-12 w-12 text-primary" />
					</div>
					<h2 className="text-2xl font-bold mb-4">Try Osmynt Interactive Demo</h2>
					<p className="text-muted-foreground mb-6 max-w-md">
						Experience how Osmynt works in a real VS Code environment. This demo simulates the actual
						extension workflow.
					</p>
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-md">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-amber-800">
								<strong>Demo Purpose Only:</strong> This is a simulation to show how Osmynt works. The
								actual extension provides native VS Code integration with real-time collaboration.
							</div>
						</div>
					</div>
				</div>
				<Button size="lg" onClick={() => setShowDemo(true)} className="gap-2 px-8 py-3 text-lg">
					<Play className="h-5 w-5" />
					Start Interactive Demo
				</Button>
			</div>
		</div>
	);
};
