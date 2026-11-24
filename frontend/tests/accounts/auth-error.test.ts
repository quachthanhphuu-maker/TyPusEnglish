import { describe, expect, it } from 'vitest';
import { mapAuthJsError } from '../../src/modules/accounts/lib/auth-error';

describe('safe Auth.js error mapping', () => {
  it('maps verification failures to one uniform safe message', () => {
    expect(mapAuthJsError('Verification')).toBe('LINK_INVALID');
    expect(mapAuthJsError('EmailSignin')).toBe('INTERNAL_ERROR');
    expect(mapAuthJsError('Configuration')).toBe('INTERNAL_ERROR');
  });

  it('never returns an arbitrary provider error to the client', () => {
    expect(mapAuthJsError('token=private-value')).toBe('INTERNAL_ERROR');
    expect(mapAuthJsError(null)).toBe('INTERNAL_ERROR');
  });
});
