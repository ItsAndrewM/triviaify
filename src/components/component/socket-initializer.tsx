"use client";

import { useEffect } from "react";

export default function SocketInitializer() {
	useEffect(() => {
		const initializeSocket = async () => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/socket.io`
			).catch((error) => {
				console.error("Error connecting to Socket.IO server:", error);
				// Using console.error instead of window.alert for better user experience
			});
			if (response) {
				console.log("Socket.IO initialized");
			}
		};
		initializeSocket();
	}, []);

	return null; // This component doesn't render anything
}
