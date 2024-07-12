// app/api/sessions/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/utils/db";
import { emitToSession } from "@/lib/socketio";

interface JoinSessionBody {
	session_code: string;
	display_name: string;
	name: string;
}

interface SessionResult {
	id: number;
	session_code: string;
}

export interface PlayerResult {
	id: number;
}

export async function POST(request: NextRequest) {
	const body: JoinSessionBody = await request.json();
	await fetch("http://localhost:3000/api/socketio");

	if (!body.session_code || !body.display_name || !body.name) {
		return NextResponse.json(
			{ error: "Session code, player name, and display name are required" },
			{ status: 400 }
		);
	}

	try {
		// First, check if the session exists and is active
		const sessionResult = await db.query<SessionResult>(
			"SELECT id, session_code FROM sessions WHERE session_code = $1 AND is_active = TRUE",
			[body.session_code]
		);

		if (sessionResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Session not found or not active" },
				{ status: 404 }
			);
		}

		const sessionId = sessionResult.rows[0].id;

		// Add the player to the session
		const playerResult = await db.query<PlayerResult>(
			"INSERT INTO players (session_id, name, display_name) VALUES ($1, $2, $3) RETURNING id",
			[sessionId, body.name, body.display_name]
		);

		if (playerResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Error adding player to session" },
				{ status: 500 }
			);
		}

		const newPlayer = {
			id: playerResult.rows[0].id,
			display_name: body.display_name,
			name: body.name,
		};

		// Use the emitToSession function to emit the playerJoined event
		emitToSession(body.session_code, "playerJoined", newPlayer);

		console.log("cookies", cookies().get("player_id"));

		const response = NextResponse.json(
			{
				playerId: playerResult.rows[0].id,
				session_code: sessionResult.rows[0].session_code,
				message: "Successfully joined the session",
			},
			{ status: 201 }
		);
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
	} catch (error) {
		console.error("Error joining session:", error);
		return NextResponse.json(
			{ error: "Error joining session" },
			{ status: 500 }
		);
	}
}
