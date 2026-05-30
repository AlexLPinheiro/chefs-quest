import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './tables/index';

declare const globalThis: {
    dbPool: Pool | undefined;
}

const pool = globalThis.dbPool || new Pool({
    connectionString: process.env.DATABASE_URL ?? "postgresql://pli5ca:senai-db123@senai-database.postgres.database.azure.com:5432/postgres?sslmode=require",
    ssl: process.env.DATABASE_URL?.includes("azure") ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== "production") {
    globalThis.dbPool = pool;
}

export const database = drizzle(pool, { schema });
export * from './tables/index';

export { eq, and, or, sql, desc, asc, inArray, not, isNull, isNotNull, count, sum, avg, min, max, between, like, ilike, gt, gte, lt, lte, ne, exists, notExists } from 'drizzle-orm';