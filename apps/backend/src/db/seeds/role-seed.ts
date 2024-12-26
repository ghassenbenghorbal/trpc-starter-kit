import { count, eq } from "drizzle-orm";
import logger from "../../config/logger";
import { db } from "../database";
import { roles, rolesRelations } from "../../schemas/role";
import { permissions } from "../../schemas/permission";
import { resources } from "../../schemas/resource";
import { roleResourcePermissions } from "../../schemas/role-resource-permission";

export const roleSeed = async () => {
    const [roleCount] = await db.select({ count: count() }).from(roles);
    if (roleCount.count > 1) {
        return;
    }
    logger.info("Seeding roles");

    const allPermissions = await db.query.permissions.findFirst({
        columns: { id: true },
        where: eq(permissions.name, "*"),
    });
    const editorPermission = await db.query.permissions.findFirst({
        columns: { id: true },
        where: eq(permissions.name, "editor"),
    });
    const viewerPermission = await db.query.permissions.findFirst({
        columns: { id: true },
        where: eq(permissions.name, "viewer"),
    });
    const allResources = await db.query.resources.findFirst({ columns: { id: true }, where: eq(resources.name, "*") });
    const productResource = await db.query.resources.findFirst({
        columns: { id: true },
        where: eq(resources.name, "product"),
    });
    const orderResource = await db.query.resources.findFirst({
        columns: { id: true },
        where: eq(resources.name, "order"),
    });

    const admin: typeof roles.$inferInsert = {
        name: "admin",
    };

    const customerSupport: typeof roles.$inferInsert = {
        name: "customer-support",
    };

    const sales: typeof roles.$inferInsert = {
        name: "sales",
    };

    const _roles: (typeof roles.$inferInsert)[] = [admin, customerSupport, sales];
    db.transaction(async (tx) => {
        const createdRoles = await tx.insert(roles).values(_roles).returning({ roleId: roles.id });

        await tx.insert(roleResourcePermissions).values({ roleId: createdRoles[0].roleId, resourceId: allResources?.id, permissionId: allPermissions?.id });
        
        await tx.insert(roleResourcePermissions).values({ roleId: createdRoles[1].roleId, resourceId: orderResource?.id, permissionId: viewerPermission?.id });

        await tx.insert(roleResourcePermissions).values({ roleId: createdRoles[2].roleId, resourceId: orderResource?.id, permissionId: editorPermission?.id });
        await tx.insert(roleResourcePermissions).values({ roleId: createdRoles[2].roleId, resourceId: productResource?.id, permissionId: editorPermission?.id });
    });
};
