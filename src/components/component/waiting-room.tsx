/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/TJNF0XoFQgw
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'
import { Chivo } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

chivo({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";
import { UsersIcon } from "../icons/usersIcon";
import { useRealTimePlayers } from "@/hooks/useRealTimePlayers";

export function WaitingRoom({
	session_code,
	playerId,
}: {
	session_code: string;
	playerId: string;
}) {
	const [isReady, setIsReady] = useState(false);
	const {
		players: realTimePlayers,
		loading: realTimeLoading,
		error: realTimeError,
	} = useRealTimePlayers(session_code);

	console.log(realTimePlayers);

	if (realTimeLoading)
		return (
			<div>
				<Spinner />
			</div>
		);

	if (realTimeError) {
		return <div>Error: {realTimeError.message}</div>;
	}

	return (
		<div className="bg-background text-foreground rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto my-24">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold">
					Waiting Room for{" "}
					<span className="font-medium underline underline-offset-2">
						{realTimePlayers?.session.session_name}
					</span>
				</h2>
				<div className="flex items-center gap-2">
					<UsersIcon className="w-5 h-5 text-muted-foreground" />
					<span className="text-muted-foreground">
						{realTimePlayers?.players.length} players
					</span>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{realTimePlayers?.players.map((player) => (
					<div
						className={`bg-muted rounded-lg p-4 flex flex-col items-center justify-between relative ${
							player.display_name === realTimePlayers?.session.creator_name
								? "border-2 border-primary"
								: Number(playerId) === Number(player.id)
								? "border-2 border-green-500"
								: ""
						} `}
						key={player.id}
					>
						<span
							className={`absolute top-0 left-0 -translate-x-1/3 -translate-y-1/2 px-2 py-1 bg-green-500 text-primary-foreground rounded-full ${
								Number(playerId) === Number(player.id) ? "visible" : "invisible"
							}`}
						>
							You
						</span>
						<span
							className={`absolute top-0 right-0 -translate-y-1/2 px-2 py-1 bg-primary text-primary-foreground rounded-full ${
								player.display_name === realTimePlayers?.session.creator_name
									? "visible"
									: "invisible"
							}`}
						>
							Creator
						</span>
						<div className="w-full flex items-center justify-center gap-2">
							<Avatar className="w-8 h-8">
								<AvatarImage src="/placeholder-user.jpg" />
								<AvatarFallback>P{player.id}</AvatarFallback>
							</Avatar>
							<span className="font-medium">
								{player.display_name} ({player.id})
							</span>
						</div>
						<div className="w-full flex items-center justify-center gap-2">
							{player.ready ? (
								<span className="text-green-500 font-medium text-center">
									✅ Ready
								</span>
							) : (
								<span className="text-red-500 font-medium">Not Ready ❌</span>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center mt-6">
				<Button
					onClick={() => setIsReady(!isReady)}
					className={`${isReady ? "bg-red-500" : "bg-green-500"}`}
				>
					{isReady ? "Not Ready \u274C" : "Ready \u2705"}
				</Button>
			</div>
		</div>
	);
}
