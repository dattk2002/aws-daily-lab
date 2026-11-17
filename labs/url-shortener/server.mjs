import { once } from 'node:events';
import pg from 'pg';
import { databaseConfig } from './config.mjs';
import { createRepository } from './repository.mjs';
import { createApp } from './app.mjs';

const logError = (entry) => console.error(JSON.stringify(entry));
let pool;
let server;

try {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid PORT');
  pool = new pg.Pool(databaseConfig(process.env));
  pool.on('error', () => logError({ event: 'database_pool_error' }));
  server = createApp(createRepository(pool), {
    publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://localhost:${port}`,
    logger: logError,
  });
  server.listen(port, process.env.HOST || '127.0.0.1');
  await once(server, 'listening');
  console.log(JSON.stringify({ event: 'listening', port: server.address().port }));

  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    const deadline = setTimeout(() => process.exit(1), 10_000);
    deadline.unref();
    server.close(async () => {
      await pool.end();
      clearTimeout(deadline);
    });
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
} catch {
  logError({ event: 'startup_failed', hint: 'Check PORT, DATABASE_URL, CA file and listen address' });
  if (server?.listening) server.close();
  if (pool) await pool.end();
  process.exitCode = 1;
}
