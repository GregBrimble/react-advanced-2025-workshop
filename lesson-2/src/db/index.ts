import * as schema from "./schema";
import { drizzle } from "drizzle-orm/d1";

export function getDb(env: { DB: D1Database }) {
	return drizzle(env.DB, { schema });
}
