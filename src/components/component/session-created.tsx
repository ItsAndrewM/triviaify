/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/lARkbaxQWCA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { ArrowRightIcon } from "../icons/arrowRightIcon";
import { CopyIcon } from "../icons/copyIcon";
import { SessionResult } from "@/app/api/sessions/create/route";

export function SessionCreated({ session }: { session: SessionResult }) {
	return (
		<DialogContent className="w-full max-w-md">
			<DialogHeader>
				<DialogTitle>Session Created Sucessfully!</DialogTitle>
				<DialogDescription>
					Session Name: {session.session_name}
					<br />
					Creator Name: {session.creator_name}
				</DialogDescription>
			</DialogHeader>
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<Input readOnly value={session.session_code} className="flex-1" />
					<Button
						variant="outline"
						onClick={() => {
							navigator.clipboard.writeText(session.session_code);
						}}
					>
						<CopyIcon className="w-4 h-4 mr-2" />
						Copy
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src="/placeholder-user.jpg" />
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
					<div className="text-sm">{session.creator_name}</div>
				</div>
				<Link
					href={`/session/${session.session_code}/waiting-room`}
					className="inline-flex items-center gap-2 text-primary"
					prefetch={false}
				>
					<ArrowRightIcon className="w-4 h-4" />
					Go to Waiting Room
				</Link>
			</div>
		</DialogContent>
	);
}