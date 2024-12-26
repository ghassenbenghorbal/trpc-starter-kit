import { count } from "drizzle-orm";
import logger from "../../config/logger";
import { db } from "../database";
import { permissions } from "../../schemas/permission";


export const permissionSeed = async () => {
    const [permissionCount] = await db.select({ count: count() }).from(permissions);
    if (permissionCount.count > 1) {
        return;
    }

    logger.info("Seeding permissions");

    const _permissions: typeof permissions.$inferInsert[] = [
        {
            name: "*",
        },
        {
            name: "editor",
        },
        {
            name: "viewer",
        },
    ];

    return await db.insert(permissions).values(_permissions);
};
