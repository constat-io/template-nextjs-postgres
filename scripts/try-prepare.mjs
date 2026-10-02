// Prepares the database for trying: db/schema.sql, then db/seed.sql when present. Safe to run twice.
import { existsSync, readFileSync } from 'node:fs';
import pg from 'pg';
const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is not set.'); process.exit(1); }
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  for (const file of ['db/schema.sql', 'db/seed.sql']) {
    if (!existsSync(file)) continue;
    await client.query(readFileSync(file, 'utf8'));
    console.log(`applied ${file}`);
  }
} finally { await client.end(); }
