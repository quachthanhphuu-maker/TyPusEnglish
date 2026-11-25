import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { sendGmailApiMessage } from '../../src/modules/accounts/lib/gmail-api';

describe('sendGmailApiMessage', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    process.env.GMAIL_CLIENT_ID = 'client-id';
    process.env.GMAIL_CLIENT_SECRET = 'client-secret';
    process.env.GMAIL_REFRESH_TOKEN = 'refresh-token';
    process.env.GMAIL_SENDER_EMAIL = 'sender@gmail.com';
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'access-token' }), { status: 200 }));
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 200 }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    delete process.env.GMAIL_CLIENT_ID;
    delete process.env.GMAIL_CLIENT_SECRET;
    delete process.env.GMAIL_REFRESH_TOKEN;
    delete process.env.GMAIL_SENDER_EMAIL;
  });

  it('refreshes access and sends only through Gmail API with a base64url MIME message', async () => {
    await expect(sendGmailApiMessage({
      to: 'person@example.test',
      subject: 'Xác minh email',
      text: 'Mở liên kết.',
    })).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://oauth2.googleapis.com/token', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ authorization: 'Bearer access-token' }),
    }));
    const requestBody = JSON.parse(fetchMock.mock.calls[1][1]?.body as string) as { raw: string };
    expect(Buffer.from(requestBody.raw, 'base64url').toString('utf8')).toContain('To: person@example.test');
    expect(Buffer.from(requestBody.raw, 'base64url').toString('utf8')).toContain('From: TyPusEnglish <sender@gmail.com>');
  });

  it('fails with a safe error when the refresh token expires', async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 400 }));

    await expect(sendGmailApiMessage({ to: 'person@example.test', subject: 'Verify', text: 'Open the link.' }))
      .rejects.toThrow('GMAIL_AUTH_FAILED');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
