import { faker } from "@faker-js/faker";
import logger from "../../config/logger";
import { db } from "../database";
import { admins } from "../../schemas/admin";
import { count, eq } from "drizzle-orm";
import { roles } from "../../schemas/role";
import { adminRoles } from "../../schemas/admin-role";
import bcrypt from "bcrypt";

export const adminSeed = async (numberOfUsers: number = 8) => {
    const [adminCount] = await db.select({ count: count() }).from(admins);
    if (adminCount.count > 1) {
        return;
    }
    logger.info("Seeding admins");

    const adminRole = await db.query.roles.findFirst({
        columns: {
            id: true,
        },
        where: eq(roles.name, "admin"),
    });
    if (!adminRole) {
        logger.error("Admin role not found");
        return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("degla2015", saltRounds);

    const admin: typeof admins.$inferInsert = {
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        firstname: "Admin",
        lastname: "Admin",
        image: "https://github.com/shadcn.png"
    };

    const hassen: typeof admins.$inferInsert = {
        username: "hassen",
        email: "7asyou@gmail.com",
        password: hashedPassword,
        firstname: "Hassen",
        lastname: "Degla",
        image: "https://github.com/shadcn.png"
    };

    const _admins: typeof admins.$inferInsert[] = [admin, hassen];
    for (let i = 0; i < numberOfUsers; i++) {
        const admin = {} as typeof admins.$inferInsert;
        admin.username = faker.internet.username();
        admin.email = faker.internet.email();
        admin.password = hashedPassword;
        admin.firstname = faker.person.firstName();
        admin.lastname = faker.person.lastName();
        admin.image = "https://github.com/shadcn.png";
        _admins.push(admin);
    }
    return db.transaction(async (tx) => {
        const createdUsers = await tx.insert(admins).values(_admins).returning({adminId: admins.id});
        for(let i=0; i<createdUsers.length; i++){
            await tx.insert(adminRoles).values({adminId: createdUsers[i].adminId, roleId: adminRole.id});
        }
    })
};
