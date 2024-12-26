import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pg } from "./database";

async function main() {
  await migrate(db, { migrationsFolder: "../../drizzle" });
  await pg.end();
}

main();