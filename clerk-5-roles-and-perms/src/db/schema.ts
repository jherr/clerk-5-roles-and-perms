import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const shows = sqliteTable("shows", {
  id: integer("id").primaryKey(),
  orgId: text("orgId").notNull(),
  showId: integer("showId").notNull(),
  order: integer("order").default(0).notNull(),
  name: text("name", { length: 255 }).notNull(),
  image: text("image", { length: 1024 }).notNull(),
});

export type Show = typeof shows.$inferSelect;

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey(),
  orgId: text("orgId").notNull(),
  userId: text("userId", { length: 255 }).notNull(),
  showId: integer("showId").notNull(),
  order: integer("order").notNull(),
});

export type Vote = typeof votes.$inferSelect;
