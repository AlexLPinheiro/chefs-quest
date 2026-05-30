import { integer, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { userTable } from "./user.table";

export const phaseProgressTable = pgTable("phase_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => userTable.id),
  phaseId: integer("phase_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});
