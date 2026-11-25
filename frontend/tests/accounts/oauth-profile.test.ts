import { describe, expect, it } from 'vitest';
import { mapZaloProfile } from '../../src/modules/accounts/lib/oauth-profile';

describe('Zalo OAuth profile mapping', () => {
  it('uses the stable Zalo ID and does not invent an email address', () => {
    expect(mapZaloProfile({ id: 'zalo_123', name: 'Lan', picture: { data: { url: 'https://img.example/avatar.png' } } })).toEqual({
      id: 'zalo_123', name: 'Lan', email: null, image: 'https://img.example/avatar.png',
    });
  });
});
