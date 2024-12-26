import { relations, sql } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { resources } from "./resource";
import { roles } from "./role";
import { permissions } from "./permission";

export const roleResourcePermissions = pgTable('role_resource_permissions', {
    roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id').references(() => permissions.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  }, (t) => ([
    primaryKey({ columns: [t.roleId, t.resourceId, t.permissionId] }),
]));
  
  export const roleResourcePermissionsRelations = relations(roleResourcePermissions, ({ one }) => ({
    role: one(roles, {
      fields: [roleResourcePermissions.roleId],
      references: [roles.id],
    }),
    resource: one(resources, {
      fields: [roleResourcePermissions.resourceId],
      references: [resources.id],
    }),
    permission: one(permissions, {
      fields: [roleResourcePermissions.permissionId],
      references: [permissions.id],
    }),
  }));