import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

class RequestError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function json(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let settled = false;
    const chunks = [];
    request.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > 8192) {
        settled = true;
        chunks.length = 0;
        reject(new RequestError(413, 'Request body too large'));
      } else chunks.push(chunk);
    });
    request.on('end', () => {
      if (settled) return;
      settled = true;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new RequestError(400, 'Invalid JSON')); }
    });
    request.on('error', () => reject(new RequestError(400, 'Incomplete request')));
  });
}

function validateUrl(body) {
  if (!body || Array.isArray(body) || typeof body.url !== 'string') {
    throw new RequestError(400, 'Provide a URL string');
  }
  let url;
  try { url = new URL(body.url); }
  catch { throw new RequestError(400, 'Provide an absolute HTTP or HTTPS URL'); }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new RequestError(400, 'Only HTTP and HTTPS URLs are accepted');
  }
  return url.href;
}

export function createApp(repository, {
  publicBaseUrl = 'http://localhost:3000',
  generateCode = () => randomBytes(6).toString('base64url'),
  logger = (entry) => console.error(JSON.stringify(entry)),
} = {}) {
  const baseUrl = publicBaseUrl.replace(/\/+$/, '');
  const server = createServer(async (request, response) => {
    let operation = 'request';
    try {
      const path = new URL(request.url, 'http://localhost').pathname;
      if (request.method === 'GET' && path === '/health') return json(response, 200, { status: 'ok' });
      if (request.method === 'GET' && path === '/ready') {
        operation = 'readiness';
        await repository.ping();
        return json(response, 200, { status: 'ready' });
      }
      if (request.method === 'POST' && path === '/shorten') {
        if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
          request.resume();
          throw new RequestError(415, 'Use application/json');
        }
        const url = validateUrl(await readBody(request));
        operation = 'create_link';
        for (let attempt = 0; attempt < 5; attempt++) {
          const code = generateCode();
          if (await repository.create(code, url)) return json(response, 201, { code, shortUrl: `${baseUrl}/r/${code}` });
        }
        throw new Error('Code allocation exhausted');
      }
      const match = /^\/r\/([A-Za-z0-9_-]{8})$/.exec(path);
      if (request.method === 'GET' && match) {
        operation = 'lookup_link';
        const url = await repository.find(match[1]);
        if (url) {
          response.writeHead(302, { location: url, 'cache-control': 'no-store' });
          return response.end();
        }
      }
      request.resume();
      json(response, 404, { error: 'Not found' });
    } catch (error) {
      if (error instanceof RequestError) return json(response, error.status, { error: error.message });
      // Never emit driver errors: they can contain passwords, SQL or submitted URLs.
      logger({ event: 'request_failed', operation });
      json(response, 503, { error: 'Service temporarily unavailable' });
    }
  });
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  return server;
}
