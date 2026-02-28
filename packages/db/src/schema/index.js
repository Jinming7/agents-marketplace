"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apps = exports.marketplaceReviews = exports.marketplaceApps = exports.marketplaceCategories = exports.categories = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Users table
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    name: (0, pg_core_1.text)('name'),
    avatar: (0, pg_core_1.text)('avatar'),
    bio: (0, pg_core_1.text)('bio'),
    notifications: (0, pg_core_1.boolean)('notifications').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
// Categories table
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    icon: (0, pg_core_1.text)('icon'),
    sortOrder: (0, pg_core_1.integer)('sort_order').default(0),
});
// Marketplace Categories (existing table)
exports.marketplaceCategories = (0, pg_core_1.pgTable)('marketplace_categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    icon: (0, pg_core_1.varchar)('icon', { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// Marketplace Apps (existing table)
exports.marketplaceApps = (0, pg_core_1.pgTable)('marketplace_apps', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    categoryName: (0, pg_core_1.varchar)('category_name', { length: 255 }),
    installs: (0, pg_core_1.integer)('installs'),
    rating: (0, pg_core_1.decimal)('rating', { precision: 3, scale: 2 }),
    version: (0, pg_core_1.varchar)('version', { length: 255 }),
    developer: (0, pg_core_1.varchar)('developer', { length: 255 }),
    lastUpdated: (0, pg_core_1.date)('last_updated'),
    pricing: (0, pg_core_1.varchar)('pricing', { length: 255 }),
    highlights: (0, pg_core_1.text)('highlights').array(),
    screenshots: (0, pg_core_1.text)('screenshots').array(),
    compatibility: (0, pg_core_1.text)('compatibility').array(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// Marketplace Reviews (existing table)
exports.marketplaceReviews = (0, pg_core_1.pgTable)('marketplace_reviews', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    appId: (0, pg_core_1.uuid)('app_id'),
    userId: (0, pg_core_1.varchar)('user_id', { length: 255 }).notNull(),
    userName: (0, pg_core_1.varchar)('user_name', { length: 255 }).notNull(),
    rating: (0, pg_core_1.integer)('rating').notNull(),
    comment: (0, pg_core_1.text)('comment'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
});
// Apps table (simple)
exports.apps = (0, pg_core_1.pgTable)('apps', {
    appKey: (0, pg_core_1.text)('app_key').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    summary: (0, pg_core_1.text)('summary').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
});
//# sourceMappingURL=index.js.map