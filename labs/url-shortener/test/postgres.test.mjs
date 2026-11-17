import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import pg from 'pg';
import { databaseConfig } from '../config.mjs';
import { createRepository } from '../repository.mjs';
import { initializeDatabase } from '../db-init.mjs';
import { createApp } from '../app.mjs';

test('real PostgreSQL initializes twice and persists a complete HTTP round trip', {
  skip: !process.env.DATABASE_URL && 'Set DATABASE_URL to a dedicated lab database to run integration',
}, async (t) => {
  const pool = new pg.Pool(databaseConfig(process.env));
  const code = randomBytes(6).toString('base64url');
  let server;
  let initialized = false;
  t.after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    try { if (initialized) await pool.query('DELETE FROM links WHERE code = $1', [code]); }
    finally { await pool.end(); }
  });
  await initializeDatabase(pool);
  await initializeDatabase(pool);
  const schema = await pool.query("SELECT to_regclass('public.links') AS table_name");
  assert.equal(schema.rows[0].table_name, 'links');
  initialized = true;
  const repository = createRepository(pool);
  server = createApp(repository, { publicBaseUrl: 'https://links.example.com', generateCode: () => code });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${origin}/ready`)).status, 200);
  const created = await fetch(`${origin}/shorten`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"url":"https://example.com/real-db"}',
  });
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), { code, shortUrl: `https://links.example.com/r/${code}` });
  assert.equal(await repository.create(code, 'https://other.example'), false);
  const redirect = await fetch(`${origin}/r/${code}`, { redirect: 'manual' });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('location'), 'https://example.com/real-db');
});
