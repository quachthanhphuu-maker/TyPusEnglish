import 'server-only';

import { encodeGmailRawMessage } from './gmail-message';
import { normalizeEmail } from './email';

interface GmailMessageInput {
  to: string;
  subject: string;
  text: string;
}

interface GoogleTokenResponse {
  access_token?: string;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) throw new Error('GMAIL_NOT_CONFIGURED');

  let response: Response;
  try {
    response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
      cache: 'no-store',
    });
  } catch {
    throw new Error('GMAIL_AUTH_UNAVAILABLE');
  }

  if (!response.ok) throw new Error('GMAIL_AUTH_FAILED');
  const tokens = await response.json() as GoogleTokenResponse;
  if (!tokens.access_token) throw new Error('GMAIL_AUTH_FAILED');
  return tokens.access_token;
}

export async function sendGmailApiMessage({ to, subject, text }: GmailMessageInput): Promise<void> {
  const senderEmail = normalizeEmail(process.env.GMAIL_SENDER_EMAIL);
  if (!senderEmail) throw new Error('GMAIL_NOT_CONFIGURED');

  const accessToken = await getAccessToken();
  const raw = encodeGmailRawMessage({
    to,
    from: `TyPusEnglish <${senderEmail}>`,
    subject,
    text,
  });

  let response: Response;
  try {
    response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ raw }),
      cache: 'no-store',
    });
  } catch {
    throw new Error('GMAIL_SEND_UNAVAILABLE');
  }

  if (!response.ok) throw new Error('GMAIL_SEND_FAILED');
}
