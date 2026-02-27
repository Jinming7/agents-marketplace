import { Pool } from 'pg'

// Supabase connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.nshivvjuaggohjovldfd:pengjinming123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'

// Create connection pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  query_timeout: 10000
})

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('[Supabase] Database connected successfully at:', result.rows[0].now)
    client.release()
    return true
  } catch (error) {
    console.error('[Supabase] Database connection failed:', error)
    return false
  }
}

export default pool
