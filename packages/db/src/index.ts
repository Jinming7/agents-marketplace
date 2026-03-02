import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './migrations/schema.js'

// Re-export drizzle-orm functions for consistent types
export { eq, ne, gt, gte, lt, lte, like, ilike, isNull, isNotNull, inArray, notInArray, and, or, not, between, exists, desc, asc, sql } from 'drizzle-orm'

const connectionString = process.env.DATABASE_URL!

// Disable prepare for Supabase pooler
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })

// Export tables
export const { marketplaceApps, marketplaceCategories, marketplaceReviews, users, categories, apps } = schema