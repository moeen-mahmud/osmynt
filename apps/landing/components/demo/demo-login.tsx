import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, LogIn } from "lucide-react";

type DemoLoginProps = {
	showLoginDialog: boolean;
	setShowLoginDialog: (show: boolean) => void;
	userName: string;
	userEmail: string;
	handleLogin: () => void;
	onChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeUserEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const DemoLogin: React.FC<DemoLoginProps> = ({
	showLoginDialog,
	setShowLoginDialog,
	userName,
	userEmail,
	handleLogin,
	onChangeUserName,
	onChangeUserEmail,
}) => {
	return (
		<Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
			<DialogContent id="login-form" className="sm:max-w-md" onOpenAutoFocus={e => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Github className="h-5 w-5" />
						GitHub Login
					</DialogTitle>
					<DialogDescription>Enter your details to simulate logging into Osmynt</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="user-name" className="text-sm font-medium">
							Name
						</label>
						<Input
							id="user-name"
							value={userName}
							onChange={onChangeUserName}
							placeholder="Enter your name"
							autoComplete="off"
							autoFocus={false}
							onFocus={e => {
								e.target.select();
								// Prevent Monaco Editor from stealing focus
								e.stopPropagation();
							}}
							onBlur={e => {
								// Prevent Monaco Editor from stealing focus
								e.stopPropagation();
							}}
							className="w-full"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="user-email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="user-email"
							type="email"
							value={userEmail}
							onChange={onChangeUserEmail}
							placeholder="Enter your email"
							autoComplete="off"
							autoFocus={false}
							onFocus={e => {
								e.target.select();
								// Prevent Monaco Editor from stealing focus
								e.stopPropagation();
							}}
							onBlur={e => {
								// Prevent Monaco Editor from stealing focus
								e.stopPropagation();
							}}
							className="w-full"
						/>
					</div>
					<Button
						onClick={handleLogin}
						className="w-full gap-2"
						disabled={!userName.trim() || !userEmail.trim()}
					>
						<LogIn className="h-4 w-4" />
						Login
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
