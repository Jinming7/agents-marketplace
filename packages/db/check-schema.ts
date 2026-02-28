import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

async function main() {
  const client = postgres(connectionString, { prepare: false });

  console.log('Checking existing tables...');
  const tables = await client`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log('Tables:', tables.map(t => t.table_name).join(', '));

  for (const table of tables) {
    const columns = await client`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = ${table.table_name}
    `;
    console.log(`\n${table.table_name}:`);
    columns.forEach(c => console.log(`  ${c.column_name}: ${c.data_type} (${c.is_nullable})`));
  }

  await client.end();
}

main().catch(console.error);