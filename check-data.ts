import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const DATABASE_URL = 'postgresql://postgres.nshivvjuaggohjovldfd:pengjinming123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'

async function test() {
  console.log('Checking database...')
  
  const client = postgres(DATABASE_URL, { prepare: false, max: 1 })
  const db = drizzle(client)
  
  // Check apps table
  const apps = await db.execute('SELECT COUNT(*) FROM apps')
  console.log('apps table count:', apps)
  
  // Check marketplace_apps table
  const marketplaceApps = await db.execute('SELECT COUNT(*) FROM marketplace_apps')
  console.log('marketplace_apps table count:', marketplaceApps)
  
  // Check categories table
  const categories = await db.execute('SELECT COUNT(*) FROM categories')
  console.log('categories table count:', categories)
  
  // Check users table
  const users = await db.execute('SELECT COUNT(*) FROM users')
  console.log('users table count:', users)
  
  await client.end()
}

test().catch(console.error)