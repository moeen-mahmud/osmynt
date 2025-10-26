import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";
import { guideSteps } from "@/components/demo/demo.data";

type DemoGuideProps = {
	currentGuideStep: number;
	prevGuideStep: () => void;
	nextGuideStep: () => void;
	setShowGuide: (show: boolean) => void;
};
export const DemoGuide: React.FC<DemoGuideProps> = ({
	currentGuideStep,
	prevGuideStep,
	nextGuideStep,
	setShowGuide,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<Badge variant="secondary" className="text-xs">
							Step {currentGuideStep + 1} of {guideSteps.length}
						</Badge>
						<h3 className="font-semibold text-primary">{guideSteps[currentGuideStep].title}</h3>
					</div>
					<p className="text-sm text-muted-foreground mb-3">{guideSteps[currentGuideStep].description}</p>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={prevGuideStep}
							disabled={currentGuideStep === 0}
							className="gap-1"
						>
							<ArrowLeft className="h-3 w-3" />
							Previous
						</Button>
						<Button
							size="sm"
							onClick={nextGuideStep}
							disabled={currentGuideStep === guideSteps.length - 1}
							className="gap-1"
						>
							Next
							<ArrowRight className="h-3 w-3" />
						</Button>
						<div className="flex items-center gap-1 ml-2 px-2 py-1 bg-primary/10 rounded text-xs text-primary font-medium">
							<HelpCircle className="h-3 w-3" />
							{guideSteps[currentGuideStep].action}
						</div>
					</div>
				</div>
				<Button variant="ghost" size="sm" onClick={() => setShowGuide(false)} className="ml-4">
					<X className="h-4 w-4" />
				</Button>
			</div>
		</motion.div>
	);
};
