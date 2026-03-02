import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// For Vercel serverless: use a new connection per request
const connectionString = process.env.DATABASE_URL!

let client: ReturnType<typeof postgres> | null = null
let db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!db) {
    // Disable prepare for Supabase pooler
    client = postgres(connectionString, { 
      prepare: false,
      max: 1, // Important for serverless
      idle_timeout: 0,
      connect_timeout: 10,
    })
    db = drizzle(client, { schema })
  }
  return db
}

// Export tables for convenience
export const { users, marketplaceApps, marketplaceCategories, marketplaceReviews, categories, apps } = schema

// Export drizzle operators
export { eq, ne, and, or, not, isNull, isNotNull, desc, asc, sql } from 'drizzle-orm'