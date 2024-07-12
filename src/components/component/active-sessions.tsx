"use client";

import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon } from "../icons/calendarIcon";
import Link from "next/link";
import { UsersIcon } from "../icons/usersIcon";
import { TrophyIcon } from "../icons/trophyIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Key, useState } from "react";
import useFetchActiveSessions from "@/hooks/useFetchActiveSessions";
import { SessionResult } from "@/app/api/sessions/create/route";
import { useRouter } from "next/navigation";
import { joinSession } from "@/utils/actions";

export function ActiveSessions() {
	const { data: activeSessions, mutate } = useFetchActiveSessions();
	const [isJoinLoading, setIsJoinLoading] = useState(false);
	console.log(activeSessions);

	const [session, setSession] = useState<SessionResult | null>(null);
	const router = useRouter();

	const onJoinSessionClick = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		try {
			setIsJoinLoading(true);
			const response = await joinSession(formData);
			let result;
			if ("json" in response) {
				result = await response.json();
			}
			setSession(result);
			setIsJoinLoading(false);
			mutate();
			router.push(`/session/${result.session_code}/waiting-room`);
		} catch (error: any) {
			setIsJoinLoading(false);
			alert(error.message);
		}
	};

	return (
		<section className="py-16">
			<div className="container px-4">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Latest Trivia Sessions
					</h2>
					<p className="mt-4 text-muted-foreground">
						{!activeSessions.length
							? "No active sessions"
							: "Check out the hottest trivia sessions happening right now!"}
					</p>
				</div>
				{!activeSessions.length ? null : (
					<div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{activeSessions.map((session) => (
							<Card key={session.id} className="overflow-hidden">
								<CardHeader className="flex items-center justify-between space-x-2 p-4">
									<div className="flex items-center space-x-2">
										<TrophyIcon className="h-6 w-6 text-muted-foreground" />
										<div>
											<p className="text-sm font-medium text-foreground">
												{session.session_name}
											</p>
											<p className="text-xs text-muted-foreground">
												by {session.creator_name}
											</p>
										</div>
									</div>
									{/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
										<UsersIcon className="h-4 w-4" />
										<span>24</span>
									</div> */}
								</CardHeader>
								<CardContent className="p-4">
									<p className="text-sm text-muted-foreground">
										Test your knowledge in this thrilling trivia session
										covering a wide range of topics!
									</p>
								</CardContent>
								<CardFooter className="flex items-center justify-between p-4">
									<div className="flex items-center space-x-2 text-sm text-muted-foreground">
										<CalendarIcon className="h-4 w-4" />
										<span>
											{new Date(session.created_at).toLocaleDateString()}
										</span>
									</div>
									<Dialog>
										<DialogTrigger asChild>
											<Link
												href="#"
												className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
												prefetch={false}
											>
												Join
											</Link>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Join Session</DialogTitle>
												<DialogDescription>
													Enter the session code to join this trivia session.
												</DialogDescription>
											</DialogHeader>
											<form
												className="grid gap-4 py-4"
												id="join-session-form"
												onSubmit={onJoinSessionClick}
											>
												<Input
													id="sessionCode"
													placeholder="Enter session code"
													className="w-full"
													name="session_code"
													type="text"
													required
												/>
												<Input
													id="display_name"
													placeholder="Your Display Name"
													className="w-full"
													name="display_name"
													type="text"
													required
												/>
												<Input
													id="name"
													placeholder="Your Name"
													className="w-full"
													name="name"
													type="text"
													required
												/>
											</form>
											<DialogFooter>
												<Button>Join</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
