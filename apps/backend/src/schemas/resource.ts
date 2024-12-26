import { relations, sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { roleResourcePermissions } from "./role-resource-permission";

export const resources = pgTable("resources", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const resourcesRelations = relations(resources, ({ many }) => ({
    roles: many(roleResourcePermissions),
}));
