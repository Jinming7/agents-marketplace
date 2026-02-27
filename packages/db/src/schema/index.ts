import { pgTable, text, timestamp, integer, decimal, boolean, uuid } from 'drizzle-orm/pg-core'

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

// Apps table
export const apps = pgTable('apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  icon: text('icon'),
  version: text('version'),
  developer: text('developer'),
  installs: integer('installs').default(0),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0'),
  screenshots: text('screenshots').array(),
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Installations table (user-app relationship)
export const installations = pgTable('installations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  appId: uuid('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
  installedAt: timestamp('installed_at').defaultNow(),
})

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
})

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  appId: uuid('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  title: text('title'),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Audit log table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
})