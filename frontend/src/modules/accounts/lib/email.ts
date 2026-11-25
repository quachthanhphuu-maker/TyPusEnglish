import { z } from 'zod';

const emailSchema = z.email().max(254);

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return emailSchema.safeParse(email).success ? email : null;
}
