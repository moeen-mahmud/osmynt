import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Send } from "lucide-react";

type DemoInviteProps = {
	showInviteDialog: boolean;
	setShowInviteDialog: (show: boolean) => void;
	handleInviteBob: () => void;
};
export const DemoInvite: React.FC<DemoInviteProps> = ({ showInviteDialog, setShowInviteDialog, handleInviteBob }) => {
	return (
		<Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite Bob to Your Team</DialogTitle>
					<DialogDescription>Send an invitation to Bob to join your team</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="p-4 bg-muted/30 rounded-lg">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
								B
							</div>
							<div>
								<div className="font-medium">Bob</div>
								<div className="text-sm text-muted-foreground">bob@osmynt.com</div>
							</div>
						</div>
					</div>
					<Button onClick={handleInviteBob} className="w-full gap-2">
						<Send className="h-4 w-4" />
						Send Invitation
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
