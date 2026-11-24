import { describe, expect, it } from 'vitest';
import type { UserDTO } from '../../src/modules/accounts/contracts/auth-contract';
import { can } from '../../src/modules/accounts/lib/authorization';

const tutor: UserDTO = {
  id: 'user_tutor',
  email: 'tutor@example.com',
  name: 'Tutor',
  roles: ['tutor', 'independent_learner'],
  onboardingStatus: 'COMPLETE',
  activeWorkspace: 'independent_learner',
};

describe('deny-by-default account authorization', () => {
  it('allows only self account reads and updates', () => {
    expect(can(tutor, 'account:read:self', { ownerId: tutor.id })).toBe(true);
    expect(can(tutor, 'account:update:self', { ownerId: 'other_user' })).toBe(false);
    expect(can(null, 'account:read:self', { ownerId: tutor.id })).toBe(false);
  });

  it('checks stored account roles when selecting a workspace', () => {
    expect(can(tutor, 'workspace:select', { role: 'tutor' })).toBe(true);
    expect(can(tutor, 'workspace:select', { role: 'student' })).toBe(false);
  });

  it('restricts self-service role acquisition and denies unknown actions', () => {
    expect(
      can(tutor, 'role:acquire:self-service', {
        ownerId: tutor.id,
        role: 'tutor',
      }),
    ).toBe(true);
    expect(
      can(tutor, 'role:acquire:self-service', {
        ownerId: tutor.id,
        role: 'parent',
      }),
    ).toBe(false);
    expect(can(tutor, 'class:read', { ownerId: tutor.id })).toBe(false);
  });
});
