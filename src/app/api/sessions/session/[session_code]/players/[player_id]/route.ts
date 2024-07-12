import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { handleDbError } from "@/utils/helpers";
import { Player } from "@/hooks/useFetchPlayerById";

export async function GET(
	request: NextRequest,
	{ params }: { params: { session_code: string; player_id: string } }
) {
	const { session_code, player_id } = params;

	if (!session_code || !player_id) {
		return NextResponse.json({
			error: "Missing session_code or player_id",
			status: 400,
		});
	}

	try {
		// First, verify that the session exists and is active
		const sessionResult = await db.query<{ id: number }>(
			"SELECT id FROM sessions WHERE session_code = $1 AND is_active = TRUE",
			[session_code]
		);

		if (sessionResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Session not found or not active" },
				{ status: 404 }
			);
		}

		const sessionId = sessionResult.rows[0].id;

		// Then, verify that the player exists in the session
		const playerResult = await db.query<Player>(
			"SELECT id, display_name, ready, name, team_id FROM players WHERE id = $1 AND session_id = $2",
			[player_id, sessionId]
		);

		if (playerResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Player not found in this session" },
				{ status: 404 }
			);
		}

		return NextResponse.json(playerResult.rows[0], { status: 200 });
	} catch (error) {
		const { status, message } = handleDbError(error);
		return NextResponse.json({ error: message }, { status });
	}
}
