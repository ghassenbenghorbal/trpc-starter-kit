import { relations, sql } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { roles } from "./role";
import { admins } from "./admin";

// Junction tables for many-to-many relationships
export const adminRoles = pgTable(
    "admin_roles",
    {
        adminId: uuid("admin_id").references(() => admins.id, { onDelete: "cascade" }),
        roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [primaryKey({ columns: [t.adminId, t.roleId] })]
);

export const adminRolesRelations = relations(adminRoles, ({ one }) => ({
    admin: one(admins, {
        fields: [adminRoles.adminId],
        references: [admins.id],
    }),
    role: one(roles, {
        fields: [adminRoles.roleId],
        references: [roles.id],
    }),
}));
