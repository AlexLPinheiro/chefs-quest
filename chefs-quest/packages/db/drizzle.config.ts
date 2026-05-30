import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/tables/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://pli5ca:senai-db123@senai-database.postgres.database.azure.com:5432/postgres?sslmode=require",
  },
});
