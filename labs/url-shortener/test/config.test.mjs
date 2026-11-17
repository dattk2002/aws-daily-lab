import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pg from 'pg';
import { databaseConfig } from '../config.mjs';

test('local database explicitly disables TLS', () => {
  const config = databaseConfig({ DATABASE_URL: 'postgres://lab:lab@127.0.0.1:5432/lab' });
  const client = new pg.Client(config);
  assert.equal(client.connectionParameters.database, 'lab');
  assert.equal(client.connectionParameters.ssl, false);
});

test('CA file enables certificate verification and URL query cannot override it', async (t) => {
  const folder = await mkdtemp(join(tmpdir(), 'aws-lab-ca-'));
  t.after(() => rm(folder, { recursive: true }));
  const certificate = join(folder, 'ca.pem');
  await writeFile(certificate, 'test CA content');
  const config = databaseConfig({
    DATABASE_URL: 'postgres://labapp:example@db.example:5432/lab?sslmode=no-verify&sslrootcert=/missing&sslcert=/missing&sslkey=/missing&application_name=lab',
    PGSSLROOTCERT: certificate,
  });
  const url = new URL(config.connectionString);
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) assert.equal(url.searchParams.has(key), false);
  assert.equal(url.searchParams.get('application_name'), 'lab');
  const client = new pg.Client(config);
  assert.equal(client.connectionParameters.ssl.ca, 'test CA content');
  assert.equal(client.connectionParameters.ssl.rejectUnauthorized, true);
});

test('missing database URL fails without disclosing unrelated environment data', () => {
  assert.throws(() => databaseConfig({}), /DATABASE_URL/);
});

test('missing CA file fails instead of silently disabling verification', () => {
  assert.throws(() => databaseConfig({ DATABASE_URL: 'postgres://lab:lab@localhost/lab', PGSSLROOTCERT: '/missing/ca.pem' }));
});
