import { describe, expect, it } from 'vitest';
import {
  createAuthRequestContext,
  getAuthRequestContext,
  runWithAuthRequestContext,
} from '../../src/modules/accounts/lib/request-context';

describe('request-scoped auth context', () => {
  it('uses reverse-proxy IP and locale headers without retaining raw email', () => {
    const context = createAuthRequestContext(
      new Headers({
        'x-real-ip': '203.0.113.8',
        'x-forwarded-for': '198.51.100.1, 10.0.0.1',
        referer: 'https://example.test/en/login',
      }),
    );
    expect(context).toEqual({ clientIp: '203.0.113.8', locale: 'en' });
  });

  it('falls back to the first forwarded IP and default locale', () => {
    const context = createAuthRequestContext(
      new Headers({ 'x-forwarded-for': '198.51.100.4, 10.0.0.2' }),
    );
    expect(context).toEqual({ clientIp: '198.51.100.4', locale: 'vi' });
  });

  it('keeps context isolated to the active asynchronous request', async () => {
    const context = { clientIp: '203.0.113.9', locale: 'vi' as const };
    await runWithAuthRequestContext(context, async () => {
      await Promise.resolve();
      expect(getAuthRequestContext()).toEqual(context);
    });
    expect(getAuthRequestContext()).toBeUndefined();
  });
});
