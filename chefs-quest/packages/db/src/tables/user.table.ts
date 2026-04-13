import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable('user',
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        password: text("password").notNull(),
        createdAt: timestamp().defaultNow()
    }
)