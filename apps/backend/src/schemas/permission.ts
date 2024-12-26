import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { roleResourcePermissions } from "./role-resource-permission";

// Permission table
export const permissions = pgTable("permissions", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
    roles: many(roleResourcePermissions),
}));
