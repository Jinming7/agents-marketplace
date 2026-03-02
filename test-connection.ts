import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://postgres.nshivvjuaggohjovldfd:pengjinming123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'
  });
  
  try {
    await client.connect();
    const result = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('✅ Database connected successfully!');
    console.log('Tables:', result.rows.map(r => r.table_name).join(', '));
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
