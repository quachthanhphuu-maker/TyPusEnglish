import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Account = { provider: string; providerAccountId: string; userId: string; type: 'oauth' };
type User = { id: string; email: string | null; name: string | null };

const require = createRequire(import.meta.url);
const nextAuthEntry = require.resolve('next-auth');
const callbackHandler = require(resolve(dirname(nextAuthEntry), 'core/lib/callback-handler.js')).default as (args: {
  sessionToken?: string;
  profile: Record<string, unknown>;
  account: Omit<Account, 'userId'>;
  options: Record<string, any>;
}) => Promise<{ user: User; isNewUser: boolean }>;

function setup(initial: { users?: User[]; accounts?: Account[]; sessionUserId?: string } = {}) {
  const users = new Map((initial.users ?? []).map((user) => [user.id, user]));
  const accounts = [...(initial.accounts ?? [])];
  const linked: Account[] = [];
  const adapter = {
    async getUserByAccount(where: { provider: string; providerAccountId: string }) {
      const account = accounts.find((entry) => entry.provider === where.provider && entry.providerAccountId === where.providerAccountId);
      return account ? users.get(account.userId) ?? null : null;
    },
    async getUser(id: string) { return users.get(id) ?? null; },
    async getUserByEmail(email: string) { return Array.from(users.values()).find((user) => user.email === email) ?? null; },
    async createUser(input: Omit<User, 'id'>) {
      const user = { ...input, id: `new-${users.size + 1}` };
      users.set(user.id, user);
      return user;
    },
    async linkAccount(account: Account) { accounts.push(account); linked.push(account); return account; },
    async updateUser(input: Partial<User> & { id: string }) { const user = { ...users.get(input.id)!, ...input }; users.set(user.id, user); return user; },
    async createSession() { throw new Error('JWT sessions should not use adapter sessions'); },
  };
  const options = {
    adapter,
    session: { strategy: 'jwt', maxAge: 60 * 60, generateSessionToken: () => 'unused' },
    jwt: { decode: async ({ token }: { token: string }) => token === 'signed-in' ? { sub: initial.sessionUserId } : null },
    events: {},
  };
  return { options, users, accounts, linked };
}

const googleAccount = { provider: 'google', providerAccountId: 'google-id-1', type: 'oauth' as const };
const googleProfile = { id: 'google-id-1', email: 'person@example.test', name: 'Google Person' };

describe('Google OAuth account linking with Auth.js v4 adapter flow', () => {
  it('creates a new account and links the Google identity on first sign-in', async () => {
    const state = setup();
    const result = await callbackHandler({ options: state.options, profile: googleProfile, account: googleAccount });

    expect(result.isNewUser).toBe(true);
    expect(result.user.email).toBe('person@example.test');
    expect(state.linked).toEqual([{ ...googleAccount, userId: result.user.id }]);
  });

  it('signs an existing linked Google identity into its original account', async () => {
    const linkedUser = { id: 'user-1', email: 'person@example.test', name: 'Existing Person' };
    const state = setup({ users: [linkedUser], accounts: [{ ...googleAccount, userId: linkedUser.id }] });
    const result = await callbackHandler({ options: state.options, profile: googleProfile, account: googleAccount });

    expect(result.user).toEqual(linkedUser);
    expect(result.isNewUser).toBe(false);
    expect(state.linked).toHaveLength(0);
  });

  it('links the identity to the authenticated account even when its email matches', async () => {
    const signedInUser = { id: 'user-1', email: 'person@example.test', name: 'Existing Person' };
    const state = setup({ users: [signedInUser], sessionUserId: signedInUser.id });
    const result = await callbackHandler({ sessionToken: 'signed-in', options: state.options, profile: googleProfile, account: googleAccount });

    expect(result.user).toEqual(signedInUser);
    expect(state.linked).toEqual([{ ...googleAccount, userId: signedInUser.id }]);
  });

  it('does not merge a signed-out Google identity into an account with the same email', async () => {
    const existingUser = { id: 'user-1', email: 'person@example.test', name: 'Existing Person' };
    const state = setup({ users: [existingUser] });

    await expect(callbackHandler({ options: state.options, profile: googleProfile, account: googleAccount })).rejects.toMatchObject({ name: 'AccountNotLinkedError' });
    expect(state.linked).toHaveLength(0);
  });

  it('refuses to attach a Google identity already owned by a different account', async () => {
    const signedInUser = { id: 'user-1', email: 'person@example.test', name: 'Signed In' };
    const identityOwner = { id: 'user-2', email: 'other@example.test', name: 'Other User' };
    const state = setup({
      users: [signedInUser, identityOwner],
      accounts: [{ ...googleAccount, userId: identityOwner.id }],
      sessionUserId: signedInUser.id,
    });

    await expect(callbackHandler({ sessionToken: 'signed-in', options: state.options, profile: googleProfile, account: googleAccount })).rejects.toMatchObject({ name: 'AccountNotLinkedError' });
  });
});
