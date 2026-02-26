import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { Client } from 'pg';
import path from 'node:path';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sqlPath = path.resolve(process.cwd(), '../../supabase/init.sql');
const sql = await readFile(sqlPath, 'utf8');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

await client.connect();
await client.query(sql);
const { rows } = await client.query('select count(*)::int as count from public.apps');
console.log('init ok, apps count =', rows[0]?.count ?? 0);
await client.end();
