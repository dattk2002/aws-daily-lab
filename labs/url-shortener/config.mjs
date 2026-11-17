import { readFileSync } from 'node:fs';

export function databaseConfig(env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const url = new URL(env.DATABASE_URL);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('DATABASE_URL must use PostgreSQL');
  // pg parses these after explicit config; remove them to retain our TLS policy.
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) url.searchParams.delete(key);
  return {
    connectionString: url.toString(),
    ssl: env.PGSSLROOTCERT ? { ca: readFileSync(env.PGSSLROOTCERT, 'utf8'), rejectUnauthorized: true } : false,
    connectionTimeoutMillis: 5000,
    query_timeout: 5000,
    max: 5,
  };
}
