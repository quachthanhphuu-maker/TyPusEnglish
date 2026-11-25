import { createHmac, randomUUID } from 'node:crypto';

export interface RateLimitQueryClient {
  $queryRaw<T = unknown>(
    query: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T>;
}

export function hashRateLimitIdentifier(identifier: string, secret: string): string {
  return createHmac('sha256', secret).update(identifier).digest('hex');
}

export function getRateLimitWindowStart(now: Date, windowMs: number): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

export async function consumePersistentRateLimit(
  db: RateLimitQueryClient,
  identifier: string,
  secret: string,
  limit: number,
  windowMs: number,
  now: Date = new Date(),
): Promise<boolean> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('Rate limit must be a positive integer');
  }
  if (!Number.isFinite(windowMs) || windowMs <= 0) {
    throw new RangeError('Rate limit window must be positive');
  }

  const identifierHash = hashRateLimitIdentifier(identifier, secret);
  const windowStart = getRateLimitWindowStart(now, windowMs);
  const expiresAt = new Date(windowStart.getTime() + windowMs);
  const rows = await db.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "rate_limit_buckets"
      ("id", "identifier_hash", "window_start", "count", "expires_at")
    VALUES
      (${randomUUID()}, ${identifierHash}, ${windowStart}, 1, ${expiresAt})
    ON CONFLICT ("identifier_hash", "window_start")
    DO UPDATE SET "count" = "rate_limit_buckets"."count" + 1
    WHERE "rate_limit_buckets"."count" < ${limit}
    RETURNING "count"
  `;

  return rows.length > 0;
}
