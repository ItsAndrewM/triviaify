import { NextRequest, NextResponse } from "next/server";
import { initSocketIO } from "@/lib/socketio";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
	const io = initSocketIO();

	if (io) {
		console.log("Socket.IO is running");
		return new NextResponse("Socket.IO is running", { status: 200 });
	} else {
		console.log("Failed to initialize Socket.IO");
		return new NextResponse("Failed to initialize Socket.IO", { status: 500 });
	}
}
