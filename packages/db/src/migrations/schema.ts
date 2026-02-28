import { pgTable, text, timestamp, uuid, varchar, integer, numeric, date, unique, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const apps = pgTable("apps", {
	appKey: text("app_key").primaryKey().notNull(),
	name: text().notNull(),
	summary: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const marketplaceApps = pgTable("marketplace_apps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	categoryName: varchar("category_name", { length: 255 }),
	installs: integer(),
	rating: numeric({ precision: 3, scale:  2 }),
	version: varchar({ length: 255 }),
	developer: varchar({ length: 255 }),
	lastUpdated: date("last_updated"),
	pricing: varchar({ length: 255 }),
	highlights: text().array(),
	screenshots: text().array(),
	compatibility: text().array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const marketplaceCategories = pgTable("marketplace_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	icon: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const marketplaceReviews = pgTable("marketplace_reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	appId: uuid("app_id"),
	userId: varchar("user_id", { length: 255 }).notNull(),
	userName: varchar("user_name", { length: 255 }).notNull(),
	rating: integer().notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
});

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	icon: text(),
	sortOrder: integer("sort_order").default(0),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	name: text(),
	avatar: text(),
	bio: text(),
	notifications: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
