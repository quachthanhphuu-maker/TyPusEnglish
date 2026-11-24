import type { DefaultSession } from 'next-auth';
import type { UserDTO } from '@/modules/accounts/contracts/auth-contract';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: UserDTO;
  }
}
