import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Get database URL with validation
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set!')
  console.error('Please create .env.local file with DATABASE_URL')
}

let client: ReturnType<typeof postgres> | null = null
let db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured. Please set it in .env.local')
  }
  
  if (!db) {
    try {
      // Disable prepare for Supabase pooler
      client = postgres(connectionString, { 
        prepare: false,
        max: 1, // Important for serverless
        idle_timeout: 0,
        connect_timeout: 10,
      })
      db = drizzle(client, { schema })
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Failed to connect to database:', error)
      throw error
    }
  }
  return db
}

// Export tables for convenience
export const { users, marketplaceApps, marketplaceCategories, marketplaceReviews, categories, apps } = schema

// Export drizzle operators
export { eq, ne, and, or, not, isNull, isNotNull, desc, asc, sql } from 'drizzle-orm'