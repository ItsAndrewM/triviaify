import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export const initSocketIO = (server: HTTPServer) => {
	console.log(server);
	if (io) return io;

	io = new SocketIOServer(server, {
		path: "/socket.io",
	});

	io.on("connection", (socket) => {
		console.log("A client connected");

		socket.on("joinSession", (sessionCode: string) => {
			socket.join(sessionCode);
			console.log(`Socket joined session: ${sessionCode}`);
		});

		socket.on("leaveSession", (sessionCode: string) => {
			socket.leave(sessionCode);
			console.log(`Socket left session: ${sessionCode}`);
		});

		socket.on(
			"sendMessage",
			(messageData: {
				sender: string;
				message: string;
				sessionCode: string;
			}) => {
				if (io) {
					io.to(messageData.sessionCode).emit("newMessage", messageData);
				}
			}
		);

		socket.on("playerJoined", (playerData) => {
			if (io) {
				socket.to(playerData.sessionCode).emit("playerJoined", playerData);
			}
		});

		socket.on("disconnect", () => {
			console.log("A client disconnected");
		});
	});

	console.log("Socket.IO initialized");
	return io;
};

export const getSocketIO = () => {
	if (!io) {
		throw new Error(
			"Socket.IO has not been initialized. Please call initSocketIO first."
		);
	}
	return io;
};

export const emitToSession = (
	sessionCode: string,
	event: string,
	data: any
) => {
	const socketIO = getSocketIO();
	socketIO.to(sessionCode).emit(event, data);
};
