import { defineConfig } from "drizzle-kit";
if (!process.env.DB_URL) {
    throw new Error("DB_URL environment variable is required");
}
export default defineConfig({
    schema: "./src/schemas/*",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL,
    },
    verbose: true,
    strict: true,
});
