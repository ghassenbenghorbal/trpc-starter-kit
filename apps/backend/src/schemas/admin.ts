import { relations, sql } from 'drizzle-orm';
import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';
import { adminRoles } from './admin-role';

export const admins = pgTable('admins', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstname: text('firstname').notNull(),
    lastname: text('lastname').notNull(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    image: text('image'),
    password: text('password').notNull(),
    phone: text('phone'),
    position: text('position'),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const adminsRelations = relations(admins, ({ one, many }) => ({
    roles: many(adminRoles),
  }));