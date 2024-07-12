// app/api/sessions/[sessionCode]/players/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { handleDbError } from "@/utils/helpers";

export interface Player {
	id: number;
	name: string;
	display_name: string;
	team_id: number | null;
	ready: boolean;
}

export interface SessionResult {
	id: number;
	session_code: string;
	session_name: string;
	creator_name: string;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { session_code: string } }
) {
	const { session_code: sessionCode } = params;

	if (!sessionCode) {
		return NextResponse.json(
			{ error: "Session code is required" },
			{ status: 400 }
		);
	}

	try {
		// First, verify that the session exists and is active
		const sessionResult = await db.query<SessionResult>(
			"SELECT id, session_code, session_name, creator_name FROM sessions WHERE session_code = $1 AND is_active = TRUE",
			[sessionCode]
		);

		if (sessionResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Session not found or not active" },
				{ status: 404 }
			);
		}

		const sessionId = sessionResult.rows[0].id;

		// Fetch all players for this session
		const playersResult = await db.query<Player>(
			"SELECT id, name, display_name, team_id, ready FROM players WHERE session_id = $1 ORDER BY id",
			[sessionId]
		);

		return NextResponse.json(
			{ players: playersResult.rows, session: sessionResult.rows[0] },
			{ status: 200 }
		);
	} catch (error) {
		const { status, message } = handleDbError(error);
		return NextResponse.json({ error: message }, { status });
	}
}
