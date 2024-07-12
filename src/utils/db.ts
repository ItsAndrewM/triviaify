// utils/db.ts
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export default {
	query: <T = any>(text: string, params?: any[]) => pool.query<T>(text, params),
};
