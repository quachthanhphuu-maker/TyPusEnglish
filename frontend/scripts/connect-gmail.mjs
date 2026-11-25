import { createServer } from 'node:http';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const port = 8787;
const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const envPath = resolve('.env.local');

if (!clientId || !clientSecret) {
  throw new Error('Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in frontend/.env.local first.');
}

try {
  execFileSync('git', ['check-ignore', '--quiet', '.env.local'], { stdio: 'ignore' });
} catch {
  throw new Error('Refusing to write a Gmail token because .env.local is not Git-ignored.');
}

const state = randomBytes(32).toString('hex');
const codeVerifier = randomBytes(48).toString('base64url');
const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authorizationUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/gmail.send',
  access_type: 'offline',
  prompt: 'consent',
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
  state,
}).toString();

const server = createServer(async (request, response) => {
  const callback = new URL(request.url ?? '/', redirectUri);
  if (callback.pathname !== '/oauth2callback') {
    response.writeHead(404).end('Not found.');
    return;
  }

  const returnedState = callback.searchParams.get('state') ?? '';
  const expected = Buffer.from(state);
  const received = Buffer.from(returnedState);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Authorization state did not match.');
    return;
  }

  if (callback.searchParams.has('error')) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Gmail authorization was not completed. You can close this tab.');
    server.close();
    return;
  }

  const code = callback.searchParams.get('code');
  if (!code) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Authorization code is missing.');
    return;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });
    if (!tokenResponse.ok) throw new Error('Google rejected the authorization code.');

    const tokenPayload = await tokenResponse.json();
    if (typeof tokenPayload.refresh_token !== 'string' || !tokenPayload.refresh_token) {
      throw new Error('No refresh token returned. Revoke the app grant and run the setup again.');
    }

    const currentEnv = readFileSync(envPath, 'utf8');
    const refreshTokenLine = `GMAIL_REFRESH_TOKEN=${tokenPayload.refresh_token}`;
    const nextEnv = /^GMAIL_REFRESH_TOKEN=.*$/m.test(currentEnv)
      ? currentEnv.replace(/^GMAIL_REFRESH_TOKEN=.*$/m, refreshTokenLine)
      : `${currentEnv.trimEnd()}\n${refreshTokenLine}\n`;
    writeFileSync(envPath, nextEnv, 'utf8');
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end('Gmail sending is connected. You can close this tab.');
    console.log('Gmail refresh token saved to the Git-ignored frontend/.env.local.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gmail authorization failed.';
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }).end(message);
    console.error(message);
  } finally {
    server.close();
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Open this URL to authorize the Gmail sender:\n${authorizationUrl.toString()}`);
  console.log(`Waiting for the callback at ${redirectUri}`);
});

server.requestTimeout = 5 * 60 * 1000;
