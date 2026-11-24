'use client';

import { SessionProvider } from 'next-auth/react';
import { SESSION_REFRESH_INTERVAL_SECONDS } from '../lib/session-policy';

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={SESSION_REFRESH_INTERVAL_SECONDS}
      refetchOnWindowFocus
    >
      {children}
    </SessionProvider>
  );
}
