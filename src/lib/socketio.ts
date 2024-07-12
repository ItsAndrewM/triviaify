import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { NextApiResponse } from "next";

let httpServer: HTTPServer | null = null;
let io: SocketIOServer | null = null;

export const initSocketIO = () => {
	if (io) {
		return io;
	}

	if (!httpServer) {
		httpServer = createServer();
		httpServer.listen(3001); // Choose a port that doesn't conflict with your Next.js app
	}

	io = new SocketIOServer(httpServer, {
		path: "http://localhost:3000/api/socketio",
		addTrailingSlash: false,
	});

	io.on("connection", (socket) => {
		console.log("A client connected");

		socket.on("joinSession", (sessionCode: string) => {
			socket.join(sessionCode);
			console.log(`Socket joined session: ${sessionCode}`);
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
		return initSocketIO();
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
