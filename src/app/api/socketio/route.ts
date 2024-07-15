import { NextRequest, NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
	if ((globalThis as any).io) {
		console.log("Socket.IO already initialized");
		return new NextResponse("Socket.IO is running", { status: 200 });
	}

	try {
		const res = (await NextResponse.next()) as any;
		const server = res.socket?.server;

		if (!server) {
			console.log("Failed to get server from response");
			return new NextResponse("Failed to initialize Socket.IO", {
				status: 500,
			});
		}

		if (!server.io) {
			console.log("Initializing Socket.IO");
			server.io = new SocketIOServer(server, {
				path: "/socket.io",
				addTrailingSlash: false,
			});
			// @ts-ignore
			server.io.on("connection", (socket) => {
				console.log("New client connected");
				// @ts-ignore
				socket.on("joinRoom", (room) => {
					socket.join(room);
					console.log(`Client joined room: ${room}`);
				});
				// @ts-ignore
				socket.on("leaveRoom", (room) => {
					socket.leave(room);
					console.log(`Client left room: ${room}`);
				});
				// @ts-ignore
				socket.on("sendMessage", (data) => {
					server.io.to(data.room).emit("newMessage", data);
				});

				socket.on("disconnect", () => {
					console.log("Client disconnected");
				});
			});

			(globalThis as any).io = server.io;
		}

		return new NextResponse("Socket.IO is running", { status: 200 });
	} catch (error) {
		console.error("Error initializing Socket.IO:", error);
		return new NextResponse("Failed to initialize Socket.IO", { status: 500 });
	}
}
