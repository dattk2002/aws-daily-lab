import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../app.mjs';

function memoryRepository() {
  const links = new Map();
  return {
    async ping() {},
    async create(code, url) {
      if (links.has(code)) return false;
      links.set(code, url);
      return true;
    },
    async find(code) { return links.get(code) ?? null; },
  };
}

async function serve(t, repo = memoryRepository(), options = {}) {
  const server = createApp(repo, { publicBaseUrl: 'https://links.example.com', ...options });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return (path, init) => fetch(`http://127.0.0.1:${server.address().port}${path}`, init);
}

const post = (body) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body });

test('liveness succeeds independently of database availability', async (t) => {
  const request = await serve(t, { async ping() { throw new Error('offline'); } });
  const response = await request('/health');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('readiness reports database availability', async (t) => {
  const request = await serve(t);
  assert.equal((await request('/ready')).status, 200);
});

test('creating a link persists it and redirects to its exact target', async (t) => {
  const request = await serve(t);
  const response = await request('/shorten', post(JSON.stringify({ url: 'https://example.com/path?q=hello#part' })));
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.match(body.code, /^[A-Za-z0-9_-]{8}$/);
  assert.equal(body.shortUrl, `https://links.example.com/r/${body.code}`);
  const redirect = await request(`/r/${body.code}`, { redirect: 'manual' });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('location'), 'https://example.com/path?q=hello#part');
});

for (const path of ['/unknown', '/r/missing1', '/r/a/b', '/r/']) {
  test(`unknown path or code ${path} is 404`, async (t) => {
    const request = await serve(t);
    assert.equal((await request(path, { redirect: 'manual' })).status, 404);
  });
}

for (const body of ['{', 'null', '[]', '{}', '{"url":42}', '{"url":"relative/path"}', '{"url":"file:///etc/passwd"}', '{"url":"javascript:alert(1)"}']) {
  test(`invalid request body ${body} is rejected`, async (t) => {
    const request = await serve(t);
    assert.equal((await request('/shorten', post(body))).status, 400);
  });
}

test('plain HTTP URLs are accepted', async (t) => {
  const request = await serve(t);
  assert.equal((await request('/shorten', post('{"url":"http://example.com"}'))).status, 201);
});

test('Unicode URLs redirect with a valid ASCII HTTP Location header', async (t) => {
  const request = await serve(t);
  const created = await request('/shorten', post('{"url":"https://example.com/đường"}'));
  assert.equal(created.status, 201);
  const { code } = await created.json();
  const redirect = await request(`/r/${code}`, { redirect: 'manual' });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('location'), 'https://example.com/%C4%91%C6%B0%E1%BB%9Dng');
});

test('oversized request bodies return 413 without stopping the server', async (t) => {
  const request = await serve(t);
  assert.equal((await request('/shorten', post(JSON.stringify({ url: `https://example.com/${'a'.repeat(9000)}` })))).status, 413);
  assert.equal((await request('/health')).status, 200);
});

test('non-JSON body returns 415', async (t) => {
  const request = await serve(t);
  assert.equal((await request('/shorten', { method: 'POST', body: '{}' })).status, 415);
});

test('database failures yield safe responses and logs without credentials or URL data', async (t) => {
  const logs = [];
  const secret = 'postgres://labapp:secret@private-db/lab https://private.example';
  const fail = async () => { throw new Error(secret); };
  const request = await serve(t, { ping: fail, create: fail, find: fail }, { logger: (entry) => logs.push(entry) });
  assert.equal((await request('/health')).status, 200);
  for (const [path, init] of [['/ready'], ['/shorten', post('{"url":"https://private.example"}')], ['/r/abcdef12']]) {
    const response = await request(path, init);
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /secret|private-db|private\.example/);
  }
  assert.equal(logs.length, 3);
  assert.doesNotMatch(JSON.stringify(logs), /secret|private-db|private\.example/);
});

test('a duplicate generated code is retried without replacing the first URL', async (t) => {
  const codes = ['existing', 'existing', 'newcode1'];
  const request = await serve(t, memoryRepository(), { generateCode: () => codes.shift() });
  const first = await request('/shorten', post('{"url":"https://first.example"}'));
  assert.equal(first.status, 201);
  const second = await request('/shorten', post('{"url":"https://second.example"}'));
  assert.equal(second.status, 201);
  assert.equal((await second.json()).code, 'newcode1');
  assert.equal((await request('/r/existing', { redirect: 'manual' })).headers.get('location'), 'https://first.example/');
});

test('persistent code collisions stop after five attempts and keep the server usable', async (t) => {
  let generated = 0;
  const request = await serve(t, memoryRepository(), {
    generateCode: () => { generated++; return 'samecode'; }, logger() {},
  });
  await request('/shorten', post('{"url":"https://first.example"}'));
  const response = await request('/shorten', post('{"url":"https://second.example"}'));
  assert.equal(response.status, 503);
  assert.equal(generated, 6);
  assert.equal((await request('/health')).status, 200);
});
