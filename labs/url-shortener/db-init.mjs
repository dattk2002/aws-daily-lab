import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import pg from 'pg';
import { databaseConfig } from './config.mjs';

export async function initializeDatabase(pool) {
  const sql = await readFile(new URL('./sql/init.sql', import.meta.url), 'utf8');
  await pool.query(sql);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let pool;
  try {
    pool = new pg.Pool(databaseConfig(process.env));
    await initializeDatabase(pool);
    console.log(JSON.stringify({ event: 'schema_initialized' }));
  } catch {
    console.error(JSON.stringify({ event: 'schema_initialization_failed', hint: 'Check database access, configuration and CA file' }));
    process.exitCode = 1;
  } finally { if (pool) await pool.end(); }
}
