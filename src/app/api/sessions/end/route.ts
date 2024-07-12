// app/api/sessions/end/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";

interface EndSessionBody {
	session_code: string;
}

export async function POST(request: NextRequest) {
	const body: EndSessionBody = await request.json();

	if (!body.session_code) {
		return NextResponse.json(
			{ error: "Session code is required" },
			{ status: 400 }
		);
	}

	try {
		const result = await db.query(
			"UPDATE sessions SET is_active = FALSE, ended_at = CURRENT_TIMESTAMP WHERE session_code = $1 RETURNING id",
			[body.session_code]
		);

		if (result.rowCount === 0) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Session ended successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error ending session:", error);
		return NextResponse.json(
			{ error: "Error ending session" },
			{ status: 500 }
		);
	}
}
