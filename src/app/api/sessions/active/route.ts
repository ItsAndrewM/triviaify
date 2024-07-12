// app/api/sessions/active/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";

export interface ActiveSession {
	id: number;
	session_code: string;
	creator_name: string;
	created_at: string;
	session_name: string;
}

export async function GET(request: NextRequest) {
	try {
		const result = await db.query<ActiveSession>(
			"SELECT id, session_code, creator_name, created_at, session_name FROM sessions WHERE is_active = TRUE ORDER BY created_at DESC"
		);

		return NextResponse.json(result.rows, { status: 200 });
	} catch (error) {
		console.error("Error fetching active sessions:", error);
		return NextResponse.json(
			{ error: "Error fetching active sessions" },
			{ status: 500 }
		);
	}
}
