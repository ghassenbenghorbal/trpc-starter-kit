import { count } from "drizzle-orm";
import logger from "../../config/logger";
import { db } from "../database";
import { resources } from "../../schemas/resource";


export const resourceSeed = async () => {
    const [resourceCount] = await db.select({ count: count() }).from(resources);
    if (resourceCount.count > 1) {
        return;
    }

    logger.info("Seeding resources");

    const _resources: typeof resources.$inferInsert[] = [
        {
            name: "*",
        },
        {
            name: "user",
        },
        {
            name: "role",
        },
        {
            name: "permission",
        },
        {
            name: "resource",
        },
        {
            name: "product",
        },
        {
            name: "order",
        },
    ];

    return await db.insert(resources).values(_resources);
};
