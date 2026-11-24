import { describe, expect, it } from 'vitest';
import { normalizeEmail } from '../../src/modules/accounts/lib/email';
import { getSafeReturnTo } from '../../src/modules/accounts/lib/redirect';
import {
  consumePersistentRateLimit,
  getRateLimitWindowStart,
  hashRateLimitIdentifier,
} from '../../src/modules/accounts/lib/rate-limit';

describe('authentication input security', () => {
  it('normalizes valid email and rejects invalid values', () => {
    expect(normalizeEmail('  Tutor@Example.COM ')).toBe('tutor@example.com');
    expect(normalizeEmail('not-an-email')).toBeNull();
    expect(normalizeEmail('')).toBeNull();
    expect(normalizeEmail(null)).toBeNull();
  });

  it('accepts only same-origin paths in the requested locale', () => {
    expect(getSafeReturnTo('/vi/tutor/classes', 'vi')).toBe('/vi/tutor/classes');
    expect(getSafeReturnTo('/en/parent?tab=reports', 'en')).toBe(
      '/en/parent?tab=reports',
    );
    expect(getSafeReturnTo('//attacker.example', 'vi')).toBeNull();
    expect(getSafeReturnTo('https://attacker.example/vi/tutor', 'vi')).toBeNull();
    expect(getSafeReturnTo('/en/tutor', 'vi')).toBeNull();
    expect(getSafeReturnTo('/vi\\attacker', 'vi')).toBeNull();
  });

  it('hashes private identifiers and aligns fixed-window buckets', () => {
    const hash = hashRateLimitIdentifier('mail:tutor@example.com', 'test-secret');
    expect(hash).not.toContain('tutor@example.com');
    expect(hash).toBe(
      hashRateLimitIdentifier('mail:tutor@example.com', 'test-secret'),
    );
    expect(
      getRateLimitWindowStart(new Date('2026-11-24T00:01:34Z'), 60_000),
    ).toEqual(new Date('2026-11-24T00:01:00Z'));
  });

  it('uses a persistent atomic bucket without sending the raw identifier to SQL', async () => {
    let statement = '';
    let values: unknown[] = [];
    const db = {
      async $queryRaw<T>(query: TemplateStringsArray, ...parameters: unknown[]) {
        statement = query.join('?');
        values = parameters;
        return [{ count: 1 }] as T;
      },
    };

    await expect(
      consumePersistentRateLimit(
        db,
        'email:tutor@example.com',
        'test-secret',
        5,
        60_000,
        new Date('2026-11-24T00:01:34Z'),
      ),
    ).resolves.toBe(true);
    expect(statement).toContain('INSERT INTO "rate_limit_buckets"');
    expect(statement).toContain('ON CONFLICT');
    expect(values).not.toContain('email:tutor@example.com');
    expect(values).toContain(
      hashRateLimitIdentifier('email:tutor@example.com', 'test-secret'),
    );
  });
});
