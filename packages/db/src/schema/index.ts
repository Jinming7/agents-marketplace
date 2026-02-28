import { pgTable, text, timestamp, integer, decimal, boolean, uuid, date, varchar } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  bio: text('bio'),
  notifications: boolean('notifications').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
})

// Marketplace Categories (existing table)
export const marketplaceCategories = pgTable('marketplace_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

// Marketplace Apps (existing table)
export const marketplaceApps = pgTable('marketplace_apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  categoryName: varchar('category_name', { length: 255 }),
  installs: integer('installs'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  version: varchar('version', { length: 255 }),
  developer: varchar('developer', { length: 255 }),
  lastUpdated: date('last_updated'),
  pricing: varchar('pricing', { length: 255 }),
  highlights: text('highlights').array(),
  screenshots: text('screenshots').array(),
  compatibility: text('compatibility').array(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

// Marketplace Reviews (existing table)
export const marketplaceReviews = pgTable('marketplace_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id'),
  userId: varchar('user_id', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }),
})

// Apps table (simple)
export const apps = pgTable('apps', {
  appKey: text('app_key').primaryKey(),
  name: text('name').notNull(),
  summary: text('summary').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})