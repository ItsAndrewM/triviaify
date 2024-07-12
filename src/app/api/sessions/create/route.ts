// app/api/sessions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { PlayerResult } from "../join/route";
import { cookies } from "next/headers";
import { emitToSession, initSocketIO } from "@/lib/socketio";

interface CreateSessionBody {
	creator_name: string;
	session_code: string;
	session_name: string;
	name: string;
}

export interface SessionResult {
	id: number;
	session_code: string;
	creator_name: string;
	session_name: string;
}

export async function POST(request: NextRequest) {
	const body: CreateSessionBody = await request.json();
	await fetch("http://localhost:3000/api/socketio");

	const { session_code, creator_name, session_name, name } = body;

	if (!creator_name) {
		return NextResponse.json(
			{ error: "Creator name is required" },
			{ status: 400 }
		);
	}

	if (!session_code) {
		return NextResponse.json({
			error: "Session code is required",
			status: 400,
		});
	}
	if (!session_name) {
		return NextResponse.json({
			error: "Session name is required",
			status: 400,
		});
	}

	if (!name) {
		return NextResponse.json({
			error: "Player name is required",
			status: 400,
		});
	}

	try {
		const result = await db.query<SessionResult>(
			"INSERT INTO sessions (session_code, creator_name, session_name) VALUES ($1, $2, $3) RETURNING id, session_code, creator_name, session_name",
			[session_code, creator_name, session_name]
		);
		if (result.rows.length === 0) {
			return NextResponse.json({
				error: "Session not found",
				status: 404,
			});
		}
		const sessionId = result.rows[0].id;

		// Add the player to the session
		const playerResult = await db.query<PlayerResult>(
			"INSERT INTO players (session_id, name, display_name) VALUES ($1, $2, $3) RETURNING id",
			[sessionId, name, creator_name]
		);

		console.log(playerResult);

		if (playerResult.rows.length === 0) {
			return NextResponse.json({
				error: "Player insert failed",
				status: 404,
			});
		}

		console.log(playerResult.rows[0].id);
		console.log("cookies", cookies().get("player_id")?.value);

		// Use the emitToSession function to emit events

		emitToSession(session_code, "sessionCreated", {
			session_code,
			session_name,
			creator_name,
		});

		emitToSession(session_code, "playerJoined", {
			id: playerResult.rows[0].id,
			name,
			display_name: creator_name,
			session_code,
		});

		const response = NextResponse.json(result.rows[0], { status: 201 });
		response.cookies.set({
			name: "player_id",
			value: String(playerResult.rows[0].id),
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 3600, // 1 hour
			path: "/",
		});
		return response;
	} catch (error: any) {
		console.error("Error creating session:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
