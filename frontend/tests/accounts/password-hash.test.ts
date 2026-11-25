import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/modules/accounts/lib/password-hash';

describe('password hashing', () => {
  it('stores a verifiable Argon2id hash instead of the password', async () => {
    const password = 'correct horse battery staple';
    const hash = await hashPassword(password);

    expect(hash).not.toContain(password);
    expect(hash).toMatch(/^\$argon2id\$/);
    await expect(verifyPassword(hash, password)).resolves.toBe(true);
    await expect(verifyPassword(hash, 'incorrect password')).resolves.toBe(false);
  });
});
