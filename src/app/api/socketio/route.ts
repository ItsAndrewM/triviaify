import { NextRequest, NextResponse } from "next/server";
import { initSocketIO } from "@/lib/socketio";
import type { Server as HTTPServer } from "http";

let socketIOInitialized = false;

export async function GET(req: NextRequest) {
	const { socket } = req as any;
	const res = new NextResponse();
	if (!socketIOInitialized) {
		console.log("Initializing Socket.IO");
		const httpServer = socket as unknown as HTTPServer;
		initSocketIO(httpServer);
		socketIOInitialized = true;
	}
	return new NextResponse("Socket.IO server running");
}

export const dynamic = "force-dynamic";
