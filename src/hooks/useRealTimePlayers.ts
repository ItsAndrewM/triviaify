import useSWR from "swr";
import { useEffect } from "react";
import { fetcher } from "@/utils/helpers";
import { SessionAndPlayers } from "./useFetchAllPlayersForSession";
import { SessionResult } from "@/app/api/sessions/create/route";
import { useSocket } from "./useSocket";

export function useRealTimePlayers(sessionCode: string) {
	const { data, error, mutate } = useSWR<SessionAndPlayers>(
		`${process.env.NEXT_PUBLIC_SITE_URL}/api/sessions/session/${sessionCode}/players`,
		fetcher,
		{
			refreshInterval: 5000, // Refresh every 5 seconds
		}
	);
	const { socket, isConnected } = useSocket();

	useEffect(() => {
		if (socket && isConnected) {
			socket.emit("joinSession", sessionCode);

			socket.on("playerJoined", (newPlayer) => {
				console.log("New player joined:", newPlayer.display_name);
				mutate((currentData) => {
					if (!currentData)
						return { session: {} as SessionResult, players: [newPlayer] };
					return {
						...currentData,
						players: [...currentData.players, newPlayer],
					};
				}, false);
			});

			return () => {
				socket.off("playerJoined");
				socket.emit("leaveSession", sessionCode);
			};
		}
	}, [sessionCode, mutate, isConnected, socket]);

	return {
		players: data,
		loading: !error && !data,
		error: error,
		mutate,
	};
}
