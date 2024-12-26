import logger from "../config/logger";
import { permissionSeed } from "./seeds/permission-seed";
import { resourceSeed } from "./seeds/resource-seed";
import { roleSeed } from "./seeds/role-seed";
import { adminSeed } from "./seeds/admin-seed";

export const seeds = async () => {
    try {
        logger.info("Seeding the database");
        await resourceSeed();
        await permissionSeed();
        await roleSeed();
        await adminSeed(50); // -2 for the admin and hassen users
        logger.info("Database seeded successfully");
    } catch (error: any) {
        logger.error(`Error seeding the database: ${error.message}\n${error.stack}`);
    }
};

seeds();