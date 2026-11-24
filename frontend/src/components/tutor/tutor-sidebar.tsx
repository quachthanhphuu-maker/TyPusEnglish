'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Calendar,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  Users,
  Wallet,
  UserCog,
  Settings,
  CreditCard,
  HelpCircle,
  ChevronDown,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  hasSubmenu?: boolean;
}

interface MenuSection {
  title: string | null;
  items: MenuItem[];
}

interface TutorSidebarProps {
  locale: string;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function TutorSidebar({
  locale,
  className,
  collapsed = false,
  onToggleCollapse,
}: TutorSidebarProps) {
  const pathname = usePathname();

  const isEn = locale === 'en';

  const menuSections: MenuSection[] = [
    {
      title: null,
      items: [
        {
          label: isEn ? 'Overview' : 'Tổng quan',
          href: `/${locale}/tutor`,
          icon: LayoutDashboard,
          active: pathname === `/${locale}/tutor`,
        },
      ],
    },
    {
      title: isEn ? 'ACADEMIC' : 'HỌC VỤ',
      items: [
        {
          label: isEn ? 'Courses' : 'Khoá học',
          href: `/${locale}/tutor#courses`,
          icon: BookOpen,
          active: false,
        },
        {
          label: isEn ? 'Classes' : 'Lớp học',
          href: `/${locale}/tutor#classes`,
          icon: GraduationCap,
          active: false,
        },
        {
          label: isEn ? 'Timetable' : 'Thời khoá biểu',
          href: `/${locale}/tutor#schedule`,
          icon: Calendar,
          active: false,
        },
        {
          label: isEn ? 'Attendance' : 'Điểm danh',
          href: `/${locale}/tutor#attendance`,
          icon: CalendarCheck,
          active: false,
        },
        {
          label: isEn ? 'TyPus Notebook' : 'TyPus Notebook',
          href: `/${locale}/tutor#notebook`,
          icon: FileSpreadsheet,
          active: false,
        },
        {
          label: isEn ? 'Scorebook' : 'Điểm số',
          href: `/${locale}/tutor#grades`,
          icon: Award,
          active: false,
        },
      ],
    },
    {
      title: isEn ? 'STUDENTS' : 'HỌC VIÊN',
      items: [
        {
          label: isEn ? 'Student Profiles' : 'Danh sách học viên',
          href: `/${locale}/tutor#students`,
          icon: Users,
          hasSubmenu: true,
          active: false,
        },
      ],
    },
    {
      title: isEn ? 'FINANCE' : 'TÀI CHÍNH',
      items: [
        {
          label: isEn ? 'Tuition & Fees' : 'Học phí & Thu chi',
          href: `/${locale}/tutor#tuition`,
          icon: Wallet,
          hasSubmenu: true,
          active: false,
        },
      ],
    },
  ];

  const bottomItems = [
    {
      label: isEn ? 'Staff / Team' : 'Nhân sự',
      href: `/${locale}/tutor#staff`,
      icon: UserCog,
    },
    {
      label: isEn ? 'Settings' : 'Cài đặt',
      href: `/${locale}/tutor#settings`,
      icon: Settings,
    },
    {
      label: isEn ? 'Plans & Billing' : 'Gói & thanh toán',
      href: `/${locale}/tutor#billing`,
      icon: CreditCard,
    },
    {
      label: isEn ? 'Help & Guide' : 'Hướng dẫn',
      href: `/${locale}/tutor#help`,
      icon: HelpCircle,
    },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col justify-between border-r border-[#1E293B] bg-[#0B131E] text-slate-300 transition-all duration-300 select-none z-30 shrink-0',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Top Header & Workspace Switcher */}
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="flex h-16 items-center px-5 border-b border-[#1E293B]">
          <Logo href={`/${locale}`} size="sm" showText={!collapsed} />
        </div>

        {/* Workspace Card Selector */}
        <div className="p-3">
          <div className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#131E2B] p-2.5 hover:border-[#334155] transition-colors cursor-pointer group">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9] font-bold text-xs">
                🏢
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                    hoa vàng
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1 py-0.2 text-[9px] font-bold text-emerald-400">
                      <Sparkles className="h-2 w-2" /> Free
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">Chủ trung tâm</span>
                  </div>
                </div>
              )}
            </div>
            {!collapsed && <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
          </div>
        </div>

        {/* Main Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-700">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !collapsed && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold font-heading transition-all duration-150',
                      item.active
                        ? 'bg-[#0EA5E9]/15 text-[#38BDF8] shadow-sm shadow-[#0EA5E9]/10'
                        : 'text-slate-400 hover:bg-[#131E2B] hover:text-white',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-[#38BDF8]' : 'text-slate-400')} />
                    {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                    {!collapsed && item.hasSubmenu && (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Items & Collapse Toggle */}
      <div className="border-t border-[#1E293B] p-3 space-y-1 bg-[#0B131E]">
        {bottomItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-[#131E2B] hover:text-white transition-colors',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Collapse Sidebar Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-[#131E2B] hover:text-white transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4 text-slate-400" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 text-slate-400" />
                <span className="truncate">{isEn ? 'Collapse' : 'Thu gọn'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
