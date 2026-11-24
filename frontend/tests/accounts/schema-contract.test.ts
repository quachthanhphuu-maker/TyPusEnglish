import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const schemaPath = resolve(process.cwd(), 'prisma/schema.prisma');
const schema = existsSync(schemaPath) ? readFileSync(schemaPath, 'utf8') : '';
const migrationPath = resolve(
  process.cwd(),
  'prisma/migrations/20261124000000_accounts_auth_foundation/migration.sql',
);
const migration = existsSync(migrationPath) ? readFileSync(migrationPath, 'utf8') : '';

describe('Accounts database schema contract', () => {
  it('stores Auth.js users, roles, and roleless onboarding state', () => {
    expect(schema).toMatch(/model User\s*\{/);
    expect(schema).toMatch(/enum AccountRole\s*\{/);
    expect(schema).toMatch(/model UserRole\s*\{/);
    expect(schema).toMatch(/onboardingStatus\s+OnboardingStatus/);
  });

  it('stores revocable sessions with inactivity and absolute lifetime timestamps', () => {
    expect(schema).toMatch(/model Session\s*\{/);
    expect(schema).toMatch(/lastActivityAt\s+DateTime/);
    expect(schema).toMatch(/absoluteExpiresAt\s+DateTime/);
  });

  it('keeps invitation persistence in Classes while storing persistent rate-limit buckets', () => {
    expect(schema).not.toMatch(/model AccountInvitation\s*\{/);
    expect(migration).not.toContain('account_invitations');
    expect(schema).toMatch(/model RateLimitBucket\s*\{/);
    expect(schema).toMatch(/@@unique\(\[identifierHash, windowStart\]\)/);
    expect(migration).toMatch(/rate_limit_buckets_count_nonnegative_check/);
  });

  it('checks that stored session timestamps remain internally ordered', () => {
    expect(migration).toMatch(/sessions_lifetime_order_check/);
  });
});
