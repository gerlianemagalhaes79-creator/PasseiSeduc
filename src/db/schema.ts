import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStates = pgTable("user_states", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  key: text("key").notNull(), // e.g., "profile", "topics", "flashcards", "onboarded", etc.
  value: text("value").notNull(), // Stringified JSON or value
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  unique("user_key_unique").on(t.userId, t.key)
]);

export const usersRelations = relations(users, ({ many }) => ({
  states: many(userStates),
}));

export const userStatesRelations = relations(userStates, ({ one }) => ({
  user: one(users, {
    fields: [userStates.userId],
    references: [users.id],
  }),
}));
