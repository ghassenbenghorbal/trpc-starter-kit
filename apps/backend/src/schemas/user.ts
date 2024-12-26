import { relations, sql } from 'drizzle-orm';
import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';
import { userRoles } from './admin-role';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstname: text('firstname').notNull(),
    lastname: text('lastname').notNull(),
    username: text('username').notNull().unique(),
    birthdate: timestamp('birthdate').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    cin: text('cin'),
    phone: text('phone'),
    position: text('position'),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    roles: many(userRoles),
  }));