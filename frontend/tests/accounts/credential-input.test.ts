import { describe, expect, it } from 'vitest';
import { normalizeUsername, validatePassword, validateUsername, resolveLoginIdentifier } from '../../src/modules/accounts/lib/credential-input';

describe('credential input policy', () => {
  it('normalizes usernames before uniqueness checks', () => {
    expect(normalizeUsername('  Tutor.Name_1  ')).toBe('tutor.name_1');
  });

  it('accepts only usernames within the documented format', () => {
    expect(validateUsername('tutor.name_1')).toBe(true);
    expect(validateUsername('ab')).toBe(false);
    expect(validateUsername('not valid')).toBe(false);
    expect(validateUsername('-not-first')).toBe(false);
  });

  it('requires a long password without imposing character-class rules', () => {
    expect(validatePassword('long password phrase')).toBe(true);
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('x'.repeat(129))).toBe(false);
  });

  it('normalizes email and username login identifiers', () => {
    expect(resolveLoginIdentifier(' Tutor.Name ')).toBe('tutor.name');
    expect(resolveLoginIdentifier(' USER@example.COM ')).toBe('user@example.com');
    expect(resolveLoginIdentifier('bad identifier')).toBeNull();
  });
});
