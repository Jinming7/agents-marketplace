import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

async function main() {
  const client = postgres(connectionString, { prepare: false });

  console.log('Checking data...');
  
  const appsCount = await client`SELECT count(*) as count FROM marketplace_apps`;
  const categoriesCount = await client`SELECT count(*) as count FROM marketplace_categories`;
  const usersCount = await client`SELECT count(*) as count FROM users`;
  
  console.log(`marketplace_apps: ${appsCount[0].count} records`);
  console.log(`marketplace_categories: ${categoriesCount[0].count} records`);
  console.log(`users: ${usersCount[0].count} records`);

  // Show sample apps
  const apps = await client`SELECT name, category_name, rating, installs FROM marketplace_apps LIMIT 5`;
  console.log('\nSample apps:');
  apps.forEach(a => console.log(`  - ${a.name} (${a.category_name}) ⭐${a.rating} 📥${a.installs}`));

  // Show categories
  const cats = await client`SELECT name FROM marketplace_categories LIMIT 10`;
  console.log('\nCategories:', cats.map(c => c.name).join(', '));

  await client.end();
}

main().catch(console.error);