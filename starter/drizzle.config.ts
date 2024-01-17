import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  driver: "better-sqlite",
  out: "./drizzle",
  dbCredentials: {
    url: "sqlite.db",
  },
  verbose: true,
  strict: true,
});
