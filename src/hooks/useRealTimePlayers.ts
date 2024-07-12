// hooks/useRealTimePlayers.ts
import useSWR from "swr";
import { useEffect } from "react";
import io from "socket.io-client";
import { fetcher } from "@/utils/helpers";
import { SessionAndPlayers } from "./useFetchAllPlayersForSession";
import { SessionResult } from "@/app/api/sessions/create/route";

export function useRealTimePlayers(sessionCode: string) {
	const { data, error, mutate } = useSWR<SessionAndPlayers>(
		`/api/sessions/session/${sessionCode}/players`,
		fetcher,
		{
			refreshInterval: 5000, // Refresh every 5 seconds
		}
	);

	useEffect(() => {
		const socket = io({
			path: "/api/socketio",
		});

		socket.on("connect", () => {
			console.log("Connected to WebSocket");
			socket.emit("joinSession", sessionCode);
		});

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
			socket.disconnect();
		};
	}, [sessionCode, mutate]);

	return {
		players: data,
		loading: !error && !data,
		error: error,
		mutate,
	};
}
