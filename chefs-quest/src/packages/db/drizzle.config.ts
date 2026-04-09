import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/packages/db/src/migrations',
  schema: './src/packages/db/src/tables/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:root@127.0.0.1:5432/chefsQuest",
  },
});
