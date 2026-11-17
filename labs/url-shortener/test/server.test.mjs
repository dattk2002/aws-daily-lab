import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';

const cwd = new URL('..', import.meta.url);

test('startup failure emits a safe diagnostic and a nonzero exit code', () => {
  const result = spawnSync(process.execPath, ['server.mjs'], {
    cwd, encoding: 'utf8', env: { PATH: process.env.PATH, DATABASE_URL: 'postgres://user:do-not-log@[' },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /startup_failed/);
  assert.doesNotMatch(result.stderr, /do-not-log/);
});

test('entry point serves health while database is offline and exits gracefully', async (t) => {
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd, env: { PATH: process.env.PATH, DATABASE_URL: 'postgres://user:do-not-log@127.0.0.1:1/lab', PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const exited = once(child, 'exit');
  t.after(() => { if (child.exitCode === null) child.kill('SIGTERM'); });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const started = await new Promise((resolve) => {
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
      if (output.includes('\n')) resolve(JSON.parse(output.split('\n')[0]));
    });
    child.once('exit', () => resolve(null));
  });
  assert.equal(started?.event, 'listening');
  const origin = `http://127.0.0.1:${started.port}`;
  assert.equal((await fetch(`${origin}/health`)).status, 200);
  assert.equal((await fetch(`${origin}/ready`)).status, 503);
  assert.doesNotMatch(stderr, /do-not-log/);
  child.kill('SIGTERM');
  assert.deepEqual(await exited, [0, null]);
});
