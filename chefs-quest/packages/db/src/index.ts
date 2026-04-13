import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './tables/index';

declare const globalThis: {
    dbPool: Pool | undefined;
}

const pool = globalThis.dbPool || new Pool({
    connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
    globalThis.dbPool = pool;
}

export const database = drizzle(pool, { schema });
export * from './tables/index';

export { eq, and, or, sql, desc, asc, inArray, not, isNull, isNotNull, count, sum, avg, min, max, between, like, ilike, gt, gte, lt, lte, ne, exists, notExists } from 'drizzle-orm';