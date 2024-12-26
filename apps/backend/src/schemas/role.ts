import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { adminRoles } from "./admin-role";
import { roleResourcePermissions } from "./role-resource-permission";

// Role table
export const roles = pgTable('roles', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  });
  
  export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(adminRoles),
    resourcePermissions: many(roleResourcePermissions),
  }));