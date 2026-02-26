import 'dotenv/config';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  const { rows } = await client.query(
    `select exists (
      select 1 from information_schema.tables
      where table_schema='public' and table_name='apps'
    ) as apps_exists`
  );
  const exists = Boolean(rows[0]?.apps_exists);
  if (!exists) {
    console.error('apps table is missing');
    process.exit(2);
  }

  const countResult = await client.query('select count(*)::int as count from public.apps');
  console.log(JSON.stringify({ appsTable: true, appsCount: countResult.rows[0]?.count ?? 0 }));
} finally {
  await client.end();
}
