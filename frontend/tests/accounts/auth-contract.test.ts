import { describe, expect, it } from 'vitest';
import type { AuthProfileRecord } from '../../src/modules/accounts/contracts/auth-contract';
import {
  getRoleLandingPath,
  canRemoveAuthMethod,
  isSelfServiceRole,
  toUserDTO,
} from '../../src/modules/accounts/contracts/auth-contract';

describe('public Auth Contract', () => {
  it('maps only public account fields and multiple role values', () => {
    const profile: AuthProfileRecord & {
      passwordHash: string;
      sessions: Array<{ sessionToken: string }>;
    } = {
      id: 'user_1',
      email: 'tutor@example.com',
      username: 'tutor.one',
      name: null,
      onboardingStatus: 'COMPLETE',
      roles: [{ role: 'TUTOR' }, { role: 'INDEPENDENT_LEARNER' }],
      preference: { activeWorkspaceRole: 'INDEPENDENT_LEARNER' },
      passwordHash: 'must-not-leak',
      accounts: [{ provider: 'google' }, { provider: 'zalo' }],
      sessions: [{ sessionToken: 'must-not-leak' }],
    };
    const dto = toUserDTO(profile);

    expect(dto).toEqual({
      id: 'user_1',
      email: 'tutor@example.com',
      username: 'tutor.one',
      name: null,
      authMethods: ['password', 'google', 'zalo'],
      roles: ['tutor', 'independent_learner'],
      onboardingStatus: 'COMPLETE',
      activeWorkspace: 'independent_learner',
    });
    expect(JSON.stringify(dto)).not.toContain('must-not-leak');
  });

  it('allows Zalo-only users without an email address', () => {
    const dto = toUserDTO({
      id: 'zalo_user',
      email: null,
      username: null,
      name: 'Learner',
      onboardingStatus: 'NOT_STARTED',
      roles: [],
      accounts: [{ provider: 'zalo' }],
    });
    expect(dto.email).toBeNull();
    expect(dto.authMethods).toEqual(['zalo']);
  });

  it('never removes an account\'s final authentication method', () => {
    expect(canRemoveAuthMethod(['google'], 'google')).toBe(false);
    expect(canRemoveAuthMethod(['password', 'google'], 'google')).toBe(true);
    expect(canRemoveAuthMethod(['google', 'zalo'], 'google')).toBe(true);
    expect(canRemoveAuthMethod(['zalo'], 'google')).toBe(false);
  });

  it('routes zero, one, and multiple roles while honoring only an authorized workspace preference', () => {
    expect(getRoleLandingPath([], 'NOT_STARTED', null, 'vi')).toBe('/vi/onboarding');
    expect(getRoleLandingPath(['parent'], 'COMPLETE', null, 'en')).toBe('/en/parent');
    expect(
      getRoleLandingPath(['tutor', 'parent'], 'COMPLETE', 'parent', 'vi'),
    ).toBe('/vi/parent');
    expect(
      getRoleLandingPath(['tutor', 'parent'], 'COMPLETE', 'student', 'vi'),
    ).toBe('/vi/workspace');
  });

  it('allows self-service role grants only for Tutor and Independent Learner', () => {
    expect(isSelfServiceRole('tutor')).toBe(true);
    expect(isSelfServiceRole('independent_learner')).toBe(true);
    expect(isSelfServiceRole('student')).toBe(false);
    expect(isSelfServiceRole('parent')).toBe(false);
  });
});
