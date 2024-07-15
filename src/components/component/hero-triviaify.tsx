"use client";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSession, joinSession } from "@/utils/actions";
import useFetchActiveSessions from "@/hooks/useFetchActiveSessions";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { SessionCreated } from "./session-created";
import { SessionResult } from "@/app/api/sessions/create/route";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";

export function HeroTriviaify() {
	const { mutate } = useFetchActiveSessions();
	const [isLoading, setIsLoading] = useState(false);
	const [isJoinLoading, setIsJoinLoading] = useState(false);
	const [sessionCreated, setSessionCreated] = useState(false);
	const [session, setSession] = useState<SessionResult | null>(null);
	const router = useRouter();
	const { socket, isConnected } = useSocket();

	useEffect(() => {
		if (socket && isConnected) {
			console.log("Socket connected");
		}
		if (!isConnected || !socket) {
			console.log("Socket not connected");
		}
	}, [socket, isConnected]);

	const onJoinSessionClick = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		if (!isConnected || !socket) {
			alert("Please connect to the server first");
			return;
		}
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

	const onNewSessionClick = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		if (!isConnected || !socket) {
			alert("Please connect to the server first");
			return;
		}
		try {
			setIsLoading(true);
			const response = await createSession(formData);
			let result;
			if ("json" in response) {
				result = await response.json();
			}
			setSession(result);
			setIsLoading(false);
			setSessionCreated(true);
			mutate();
		} catch (error: any) {
			console.log(error);
			setIsLoading(false);
			alert(error.message);
		}
	};

	return (
		<section className="bg-muted py-24 w-full">
			<div className="container flex flex-col items-center justify-center px-4 text-center">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
					<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Triviaify
					</span>
				</h1>
				<p className="mt-6 text-lg text-muted-foreground md:text-xl lg:text-2xl">
					Unleash your trivia mastery with our thrilling online platform.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Dialog>
						<DialogTrigger asChild>
							<Button className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
								Join a Session
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Join a Session</DialogTitle>
								<DialogDescription>
									Enter the session code to join an existing trivia session.
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
								<Input
									form="join-session-form"
									type="submit"
									value={"Join"}
									disabled={isJoinLoading}
									className="cursor-pointer inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2s"
								/>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button className="inline-flex h-12 text-accent-foreground items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
								Create a New Session
							</Button>
						</DialogTrigger>
						{sessionCreated && session ? (
							<SessionCreated session={session} />
						) : (
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Create a New Session</DialogTitle>
									<DialogDescription>
										Enter the details for your new trivia session.
									</DialogDescription>
								</DialogHeader>
								<form
									onSubmit={onNewSessionClick}
									id="new-session-form"
									className="grid gap-4 py-4"
								>
									<Input
										id="sessionCode"
										placeholder="Session Code"
										className="w-full"
										name="session_code"
										required
									/>
									<Input
										id="creatorName"
										placeholder="Your Display Name"
										className="w-full"
										name="creator_name"
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
								<DialogFooter className="w-full">
									{isLoading ? (
										<Button
											disabled={true}
											className="w-full inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2s"
										>
											<Spinner className="text-white" /> Create
										</Button>
									) : (
										<Input
											type="submit"
											value={"Create"}
											form="new-session-form"
											disabled={isLoading}
											className="cursor-pointer inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2s"
										/>
									)}
								</DialogFooter>
							</DialogContent>
						)}
					</Dialog>
				</div>
			</div>
		</section>
	);
}
