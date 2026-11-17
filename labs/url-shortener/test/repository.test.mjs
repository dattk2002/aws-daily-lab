import test from 'node:test';
import assert from 'node:assert/strict';
import { createRepository } from '../repository.mjs';

test('URL input reaches PostgreSQL as a parameter rather than executable SQL', async () => {
  const calls = [];
  const repository = createRepository({
    async query(sql, values) { calls.push({ sql, values }); return { rowCount: 1, rows: [] }; },
  });
  const target = "https://example.com/?q=';DROP TABLE links;--";
  assert.equal(await repository.create('abc12345', target), true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].sql.includes(target), false);
  assert.deepEqual(calls[0].values, ['abc12345', target]);
});

test('a conflicting code is reported for bounded retry instead of overwriting data', async () => {
  const repository = createRepository({ async query() { return { rowCount: 0, rows: [] }; } });
  assert.equal(await repository.create('abc12345', 'https://example.com'), false);
});

test('lookup returns stored URL and missing codes return null', async () => {
  const repository = createRepository({
    async query(_sql, values) {
      assert.equal(values.length, 1);
      return { rows: values[0] === 'known123' ? [{ url: 'https://example.com' }] : [] };
    },
  });
  assert.equal(await repository.find('known123'), 'https://example.com');
  assert.equal(await repository.find('unknown1'), null);
});
