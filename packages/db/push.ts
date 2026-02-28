import 'dotenv/config';
import { pushSchema } from 'drizzle-kit/api';
import config from './drizzle.config';

async function main() {
  await pushSchema(config);
  console.log('Schema pushed successfully!');
}

main().catch(console.error);
