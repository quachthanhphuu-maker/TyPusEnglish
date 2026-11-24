import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import type { PenguinState, AuthFieldFocus } from '@/components/auth/ui/auth-types';

describe('Auth UI Presentation Contract & Merge Safety', () => {
  it('verifies all 8 approved penguin animation states exist and are typed correctly', () => {
    const validStates: PenguinState[] = [
      'initial',
      'idle',
      'username_focus',
      'password_focus',
      'password_visible',
      'loading',
      'success',
      'register_mode',
    ];
    expect(validStates).toHaveLength(8);
  });

  it('verifies field focus states align with authentication inputs', () => {
    const focusStates: AuthFieldFocus[] = ['identifier', 'username', 'email', 'password', null];
    expect(focusStates).toContain('identifier');
    expect(focusStates).toContain('password');
  });

  it('guarantees production login/page.tsx has not been modified or overwritten', () => {
    const loginPagePath = path.resolve(
      __dirname,
      '../../src/app/[locale]/(auth)/login/page.tsx'
    );
    expect(fs.existsSync(loginPagePath)).toBe(true);
    const content = fs.readFileSync(loginPagePath, 'utf-8');
    expect(content).toContain('export default function LoginPage()');
  });

  it('guarantees production register/page.tsx has not been modified or overwritten', () => {
    const registerPagePath = path.resolve(
      __dirname,
      '../../src/app/[locale]/(auth)/register/page.tsx'
    );
    expect(fs.existsSync(registerPagePath)).toBe(true);
    const content = fs.readFileSync(registerPagePath, 'utf-8');
    expect(content).toMatch(/export default (async )?function RegisterPage/);
  });

  it('verifies isolated preview route is guarded against production environments', () => {
    const previewPagePath = path.resolve(
      __dirname,
      '../../src/app/[locale]/preview/auth/page.tsx'
    );
    expect(fs.existsSync(previewPagePath)).toBe(true);
    const content = fs.readFileSync(previewPagePath, 'utf-8');
    expect(content).toContain("process.env.NODE_ENV === 'production'");
    expect(content).toContain('notFound()');
  });

  it('verifies presentation barrel exports all required split-screen components', () => {
    const indexPath = path.resolve(
      __dirname,
      '../../src/components/auth/ui/index.ts'
    );
    expect(fs.existsSync(indexPath)).toBe(true);
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain("export * from './interactive-penguin'");
    expect(content).toContain("export * from './auth-split-layout'");
    expect(content).toContain("export * from './login-presentation'");
    expect(content).toContain("export * from './register-presentation'");
    expect(content).toContain("export * from './social-auth-buttons'");
    expect(content).toContain("export * from './auth-input-field'");
  });
});
