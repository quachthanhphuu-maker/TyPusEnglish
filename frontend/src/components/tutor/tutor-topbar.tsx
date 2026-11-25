'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  UserPlus,
  Bell,
  Sun,
  Globe,
  ChevronDown,
  LogOut,
  Settings,
  User,
  ShieldCheck,
  SwitchCamera,
} from 'lucide-react';
import { logoutAction } from '@/modules/accounts/actions';
import { getStudentInitials } from '@/modules/dashboards/lib/student-helpers';

interface TutorTopbarProps {
  locale: string;
  userName?: string;
  userRole?: string;
  hasMultipleRoles?: boolean;
  isPreview?: boolean;
}

export function TutorTopbar({
  locale,
  userName = 'Phú Thanh',
  userRole = 'Chủ trung tâm',
  hasMultipleRoles = false,
  isPreview = false,
}: TutorTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const isEn = locale === 'en';
  const initials = getStudentInitials(userName);

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#1E293B] bg-[#0B131E]/95 px-6 backdrop-blur-xl">
      {/* Left: Quick Search Bar with Ctrl+K badge */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isEn ? 'Search classes, students... (Ctrl K)' : 'Tìm tra...'}
            className="h-9 w-full rounded-xl border border-[#1E293B] bg-[#131E2B] pl-9 pr-14 text-xs text-white placeholder:text-slate-400 outline-none transition-all focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-[#1E293B] px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-[#334155]">
            ctrl k
          </kbd>
        </div>
      </div>

      {/* Right Action Icons & User Controls */}
      <div className="flex items-center gap-3">
        {/* + Invite Member CTA button */}
        <button
          type="button"
          onClick={() => alert(isEn ? 'Invite member modal' : 'Mở hộp thoại mời thành viên')}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 hover:bg-[#0EA5E9]/20 text-[#38BDF8] px-3.5 py-1.5 text-xs font-semibold font-heading transition-all active:scale-95"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{isEn ? 'Invite member' : 'Mời thành viên'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          title={isEn ? 'Toggle theme' : 'Giao diện sáng / tối'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1E293B] bg-[#131E2B] text-slate-400 hover:text-white hover:border-[#334155] transition-colors"
        >
          <Sun className="h-4 w-4" />
        </button>

        {/* Notifications Bell with Badge */}
        <button
          type="button"
          title={isEn ? 'Notifications' : 'Thông báo'}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#1E293B] bg-[#131E2B] text-slate-400 hover:text-white hover:border-[#334155] transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#FF7A00]" />
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={isEn ? 'Switch to Vietnamese' : 'Đổi sang Tiếng Anh'}
          className="flex items-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#131E2B] px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-[#334155] transition-colors"
        >
          <Globe className="h-3.5 w-3.5 text-[#0EA5E9]" />
          <span className="uppercase">{locale === 'vi' ? 'VI' : 'EN'}</span>
        </button>

        {/* User Avatar & Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#131E2B] p-1.5 hover:border-[#334155] transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-[11px] font-bold text-white shadow-sm">
              {initials}
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* User Popover Dropdown */}
          {profileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#1E293B] bg-[#131E2B] p-2 text-xs shadow-2xl z-50 animate-in fade-in-50 zoom-in-95"
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#1E293B]">
                <p className="font-bold text-white">{userName}</p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>{userRole}</span>
                </div>
              </div>

              <div className="py-1">
                {isPreview ? (
                  <Link
                    href={`/${locale}/preview/student`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                  >
                    <SwitchCamera className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isEn ? 'Preview Student UI' : 'Xem thử giao diện Học sinh'}</span>
                  </Link>
                ) : (
                  <>
                    {hasMultipleRoles && (
                      <Link
                        href={`/${locale}/workspace`}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                      >
                        <SwitchCamera className="h-3.5 w-3.5 text-slate-400" />
                        <span>{isEn ? 'Switch workspace' : 'Chuyển không gian'}</span>
                      </Link>
                    )}
                    <Link
                      href={`/${locale}/account-security`}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                      <span>{isEn ? 'Account security' : 'Bảo mật tài khoản'}</span>
                    </Link>
                  </>
                )}
                <Link
                  href={isPreview ? `/${locale}/preview/tutor#profile` : `/${locale}/tutor#profile`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>{isEn ? 'Personal Profile' : 'Hồ sơ cá nhân'}</span>
                </Link>
                <Link
                  href={isPreview ? `/${locale}/preview/tutor#settings` : `/${locale}/tutor#settings`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>{isEn ? 'Workspace Settings' : 'Cài đặt phòng học'}</span>
                </Link>
              </div>

              {!isPreview && (
                <div className="pt-1 border-t border-[#1E293B]">
                  <form action={logoutAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Sign Out' : 'Đăng xuất'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
