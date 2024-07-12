// app/api/sessions/[sessionCode]/players/[playerId]/ready/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { handleDbError } from "@/utils/helpers";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { sessionCode: string; playerId: string } }
) {
	const { sessionCode, playerId } = params;
	const { ready } = await request.json();

	if (typeof ready !== "boolean") {
		return NextResponse.json(
			{ error: "Ready status must be a boolean" },
			{ status: 400 }
		);
	}

	try {
		// First, verify that the session exists and is active
		const sessionResult = await db.query<{ id: number }>(
			"SELECT id FROM sessions WHERE session_code = $1 AND is_active = TRUE",
			[sessionCode]
		);

		if (sessionResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Session not found or not active" },
				{ status: 404 }
			);
		}

		const sessionId = sessionResult.rows[0].id;

		// Update the player's ready status
		const result = await db.query(
			"UPDATE players SET ready = $1 WHERE id = $2 AND session_id = $3 RETURNING id, ready",
			[ready, playerId, sessionId]
		);

		if (result.rows.length === 0) {
			return NextResponse.json(
				{ error: "Player not found in this session" },
				{ status: 404 }
			);
		}

		return NextResponse.json(result.rows[0], { status: 200 });
	} catch (error) {
		const { status, message } = handleDbError(error);
		return NextResponse.json({ error: message }, { status });
	}
}
