import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/schema/index.js';

const connectionString = process.env.DATABASE_URL!;

async function main() {
  console.log('Connecting to database...');
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  console.log('Pushing schema...');

  // Create tables manually
  await client`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT,
      avatar TEXT,
      bio TEXT,
      notifications BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS apps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT,
      version TEXT,
      developer TEXT,
      installs INTEGER DEFAULT 0,
      rating DECIMAL(2,1) DEFAULT '0.0',
      screenshots TEXT[],
      last_updated TIMESTAMP DEFAULT now(),
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS installations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
      installed_at TIMESTAMP DEFAULT now()
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL,
      title TEXT,
      content TEXT,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id UUID,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `;

  console.log('Schema pushed successfully!');
  await client.end();
}

main().catch(console.error);