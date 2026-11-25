import { afterEach, describe, expect, it, vi } from 'vitest';
import { isMockMode } from '../../src/services/api-client';

afterEach(() => vi.unstubAllEnvs());

describe('business mock compatibility', () => {
  it('keeps the frontend mock services available in development by default', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true');
    expect(isMockMode()).toBe(true);
  });

  it('never enables mock services in production, even when the public flag is true', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true');
    expect(isMockMode()).toBe(false);
  });

  it('allows mock services to be disabled during development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'false');
    expect(isMockMode()).toBe(false);
  });
});
