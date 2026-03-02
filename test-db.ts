import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import bcrypt from 'bcryptjs'

const DATABASE_URL = 'postgresql://postgres.nshivvjuaggohjovldfd:pengjinming123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'

async function test() {
  console.log('Testing database connection...')
  
  try {
    const client = postgres(DATABASE_URL, { prepare: false, max: 1 })
    const db = drizzle(client)
    
    // Test simple query
    const result = await db.execute('SELECT NOW()')
    console.log('✅ Database connected:', result)
    
    // Check if users table exists
    const tableCheck = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `)
    console.log('✅ Users table columns:', tableCheck)
    
    // Try to insert a test user
    const hashedPassword = await bcrypt.hash('test123', 10)
    console.log('✅ Password hashed')
    
    await client.end()
    console.log('✅ All tests passed!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

test()