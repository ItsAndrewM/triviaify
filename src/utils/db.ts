// utils/db.ts
import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = {
	query: <T extends QueryResultRow>(text: string, params?: any[]) =>
		pool.query<T>(text, params),
};

export default db;
