import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  queryRaw: vi.fn(),
  findUser: vi.fn(),
  deleteTokens: vi.fn(),
  createToken: vi.fn(),
  transaction: vi.fn(),
  sendMessage: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    $queryRaw: mocks.queryRaw,
    $transaction: mocks.transaction,
    user: { findUnique: mocks.findUser },
    accountToken: { deleteMany: mocks.deleteTokens, create: mocks.createToken },
  },
}));
vi.mock('../../src/modules/accounts/lib/gmail-api', () => ({
  sendGmailApiMessage: mocks.sendMessage,
}));

import { requestEmailVerification } from '../../src/modules/accounts/services/credential-service';

describe('requestEmailVerification', () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = 'test-auth-secret';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.GMAIL_CLIENT_ID = 'client-id';
    process.env.GMAIL_CLIENT_SECRET = 'client-secret';
    process.env.GMAIL_REFRESH_TOKEN = 'refresh-token';
    process.env.GMAIL_SENDER_EMAIL = 'sender@gmail.com';
    mocks.queryRaw.mockResolvedValue([{ count: 1 }]);
    mocks.findUser.mockResolvedValue({
      id: 'user-1',
      email: 'person@example.test',
      emailVerified: null,
      passwordHash: 'hashed-password',
    });
    mocks.deleteTokens.mockResolvedValue({ count: 0 });
    mocks.createToken.mockResolvedValue({ id: 'token-1' });
    mocks.transaction.mockImplementation((operations: Promise<unknown>[]) => Promise.all(operations));
    mocks.sendMessage.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_URL;
    delete process.env.GMAIL_CLIENT_ID;
    delete process.env.GMAIL_CLIENT_SECRET;
    delete process.env.GMAIL_REFRESH_TOKEN;
    delete process.env.GMAIL_SENDER_EMAIL;
  });

  it('sends a fresh verification message for an existing unverified password account', async () => {
    await expect(requestEmailVerification('person@example.test', 'en')).resolves.toBeUndefined();

    expect(mocks.deleteTokens).toHaveBeenCalledWith({ where: { userId: 'user-1', purpose: 'VERIFY_EMAIL' } });
    expect(mocks.createToken).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ userId: 'user-1', purpose: 'VERIFY_EMAIL' }),
    }));
    expect(mocks.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
      to: 'person@example.test',
      subject: 'Verify your TyPusEnglish email',
    }));
  });

  it('does not reveal or send mail for missing, verified, or passwordless accounts', async () => {
    mocks.findUser.mockResolvedValueOnce(null);
    await expect(requestEmailVerification('unknown@example.test', 'vi')).resolves.toBeUndefined();
    mocks.findUser.mockResolvedValueOnce({ id: 'user-2', emailVerified: new Date(), passwordHash: 'hash' });
    await expect(requestEmailVerification('verified@example.test', 'vi')).resolves.toBeUndefined();
    mocks.findUser.mockResolvedValueOnce({ id: 'user-3', emailVerified: null, passwordHash: null });
    await expect(requestEmailVerification('passwordless@example.test', 'vi')).resolves.toBeUndefined();

    expect(mocks.sendMessage).not.toHaveBeenCalled();
    expect(mocks.createToken).not.toHaveBeenCalled();
  });

  it('keeps a generic response when Gmail delivery fails so the user can retry later', async () => {
    mocks.sendMessage.mockRejectedValue(new Error('GMAIL_AUTH_FAILED'));

    await expect(requestEmailVerification('person@example.test', 'vi')).resolves.toBeUndefined();
  });
});
