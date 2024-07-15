import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!socket) {
			socket = io(
				"http://localhost:8080" || process.env.NEXT_PUBLIC_SERVER_URL
			);
			if (!socket) {
				console.log("Error connecting to Socket.IO server");
			}
		}

		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		return () => {
			if (socket) {
				socket.off("connect");
				socket.off("disconnect");
			}
		};
	}, []);

	return { socket, isConnected };
};
