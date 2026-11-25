'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  Search,
  ShieldCheck,
  SwitchCamera,
  X,
} from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/modules/accounts/actions';
import { getStudentInitials } from '../lib/student-helpers';

export interface StudentShellUser {
  displayName: string;
  email: string | null;
  hasMultipleRoles: boolean;
}

interface StudentShellProps {
  locale: 'vi' | 'en';
  user: StudentShellUser;
  basePath?: string;
  isPreview?: boolean;
  children: React.ReactNode;
}

interface NavItem {
  key: 'overview' | 'classes' | 'schedule' | 'assignments';
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}

export function StudentShell({
  locale,
  user,
  basePath: basePathProp,
  isPreview = false,
  children,
}: StudentShellProps) {
  const t = useTranslations('student');
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const basePath = basePathProp ?? `/${locale}/student`;
  const initials = getStudentInitials(user.displayName);

  const navItems: NavItem[] = [
    {
      key: 'overview',
      label: t('nav.overview'),
      href: basePath,
      icon: LayoutDashboard,
      isActive: (path) => path === basePath,
    },
    {
      key: 'classes',
      label: t('nav.classes'),
      href: `${basePath}/classes`,
      icon: BookOpen,
      isActive: (path) => path === `${basePath}/classes` || path.startsWith(`${basePath}/classes/`),
    },
    {
      key: 'schedule',
      label: t('nav.schedule'),
      href: `${basePath}/schedule`,
      icon: CalendarDays,
      isActive: (path) => path === `${basePath}/schedule`,
    },
    {
      key: 'assignments',
      label: t('nav.assignments'),
      href: `${basePath}/assignments`,
      icon: ClipboardCheck,
      isActive: (path) => path === `${basePath}/assignments`,
    },
  ];

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchValue.trim();
    const target = query
      ? `${basePath}/assignments?q=${encodeURIComponent(query)}`
      : `${basePath}/assignments`;
    router.push(target);
  };

  const renderSidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between border-b border-[#1E293B] px-5">
          <Logo href={`/${locale}`} size="sm" showText={isMobile || !collapsed} dark />
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label={t('nav.closeMenu')}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-[#131E2B] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-[#131E2B] p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0EA5E9]/15 text-[#38BDF8]">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </div>
            {(isMobile || !collapsed) && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-bold text-white">{user.displayName}</span>
                <span className="mt-0.5 truncate text-[10px] text-slate-400">{t('portalLabel')}</span>
              </div>
            )}
          </div>
        </div>

        <nav aria-label={t('title')} className="flex-1 space-y-1 px-3 py-2">
          {(isMobile || !collapsed) && (
            <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {t('nav.learningSection')}
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive(pathname);
            return (
              <Link
                key={item.key}
                href={item.href}
                title={!isMobile && collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold font-heading transition-all duration-150',
                  active
                    ? 'bg-[#0EA5E9]/15 text-[#38BDF8] shadow-sm shadow-[#0EA5E9]/10'
                    : 'text-slate-400 hover:bg-[#131E2B] hover:text-white',
                  !isMobile && collapsed && 'justify-center px-2',
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn('h-4 w-4 shrink-0', active ? 'text-[#38BDF8]' : 'text-slate-400')}
                />
                {(isMobile || !collapsed) && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {!isMobile && (
        <div className="border-t border-[#1E293B] bg-[#0B131E] p-3">
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
            className={cn(
              'flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-[#131E2B] hover:text-white',
              collapsed && 'justify-center px-2',
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4 text-slate-400" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 text-slate-400" />
                <span className="truncate">{t('nav.collapse')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#0B131E] font-body text-slate-200 antialiased">
      <aside
        className={cn(
          'relative z-30 hidden shrink-0 select-none flex-col border-r border-[#1E293B] bg-[#0B131E] text-slate-300 transition-all duration-300 md:flex',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        {renderSidebarContent(false)}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true" aria-label={t('title')}>
          <button
            type="button"
            aria-label={t('nav.closeMenu')}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="relative z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-[#1E293B] bg-[#0B131E] text-slate-300">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-3 border-b border-[#1E293B] bg-[#0B131E]/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t('nav.openMenu')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1E293B] bg-[#131E2B] text-slate-300 hover:border-[#334155] hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="h-10 w-full rounded-xl border border-[#1E293B] bg-[#131E2B] pl-9 pr-4 text-xs text-white placeholder:text-slate-400 outline-none transition-all focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              title={t('userMenu.switchLanguage')}
              aria-label={t('userMenu.switchLanguage')}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#131E2B] px-3 text-xs font-semibold text-slate-300 transition-colors hover:border-[#334155] hover:text-white"
            >
              <Globe className="h-3.5 w-3.5 text-[#0EA5E9]" aria-hidden="true" />
              <span className="uppercase">{locale === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="flex h-10 items-center gap-2 rounded-xl border border-[#1E293B] bg-[#131E2B] px-2 transition-colors hover:border-[#334155]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-[11px] font-bold text-white shadow-sm">
                  {initials}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-[#1E293B] bg-[#131E2B] p-2 text-xs shadow-2xl"
                >
                  <div className="border-b border-[#1E293B] px-3 py-2">
                    <p className="truncate font-bold text-white">{user.displayName}</p>
                    {user.email && (
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.email}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-sky-300">
                      <GraduationCap className="h-3 w-3" aria-hidden="true" />
                      <span>{t('userMenu.studentRole')}</span>
                    </div>
                  </div>

                  <div className="space-y-1 py-1">
                    {isPreview ? (
                      <Link
                        href={`/${locale}/preview/tutor`}
                        role="menuitem"
                        className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 py-2 text-slate-300 transition-colors hover:bg-[#1E293B] hover:text-white"
                      >
                        <SwitchCamera className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                        <span>{locale === 'en' ? 'Preview Tutor UI' : 'Xem thử giao diện Gia sư'}</span>
                      </Link>
                    ) : (
                      <>
                        {user.hasMultipleRoles && (
                          <Link
                            href={`/${locale}/workspace`}
                            role="menuitem"
                            className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 py-2 text-slate-300 transition-colors hover:bg-[#1E293B] hover:text-white"
                          >
                            <SwitchCamera className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                            <span>{t('userMenu.switchWorkspace')}</span>
                          </Link>
                        )}
                        <Link
                          href={`/${locale}/account-security`}
                          role="menuitem"
                          className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 py-2 text-slate-300 transition-colors hover:bg-[#1E293B] hover:text-white"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          <span>{t('userMenu.accountSecurity')}</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {!isPreview && (
                    <div className="border-t border-[#1E293B] pt-1">
                      <form action={logoutAction}>
                        <input type="hidden" name="locale" value={locale} />
                        <button
                          type="submit"
                          role="menuitem"
                          className="flex min-h-[40px] w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t('userMenu.signOut')}</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0B131E] p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
