import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/tables/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:root@127.0.0.1:5432/chefsQuest",
  },
});
