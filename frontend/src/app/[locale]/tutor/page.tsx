import * as React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { tutorService } from '@/services/api-client';
import {
  Users,
  GraduationCap,
  Wallet,
  Calendar,
  CheckCircle2,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Gift,
  Plus,
} from 'lucide-react';

export default async function TutorDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';

  // Fetch mock business data
  const classes = await tutorService.getClasses().catch(() => []);
  const lessons = await tutorService.getLessons().catch(() => []);

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const totalClasses = classes.length;
  const todayLessonsCount = lessons.length;

  // Format today's date
  const now = new Date();
  const daysVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysVi[now.getDay()];
  const formattedDate = `${dayName}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  // Time-based greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const quickShortcuts = [
    { label: isEn ? 'Students' : 'Học viên', icon: Users, href: `/${locale}/tutor#students`, color: 'text-sky-400' },
    { label: isEn ? 'Classes' : 'Lớp học', icon: GraduationCap, href: `/${locale}/tutor#classes`, color: 'text-blue-400' },
    { label: isEn ? 'Courses' : 'Khoá học', icon: BookOpen, href: `/${locale}/tutor#courses`, color: 'text-amber-400' },
    { label: isEn ? 'Attendance' : 'Điểm danh', icon: CalendarCheck, href: `/${locale}/tutor#attendance`, color: 'text-emerald-400' },
    { label: isEn ? 'Tuition' : 'Học phí', icon: Wallet, href: `/${locale}/tutor#tuition`, color: 'text-rose-400' },
    { label: isEn ? 'Reports' : 'Báo cáo', icon: TrendingUp, href: `/${locale}/tutor#reports`, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Header Greeting Banner */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          {isEn ? 'Good afternoon, ' : `${greeting}, `}
          <span className="text-[#38BDF8]">Thanh</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 font-body">
          hoa vàng • {isEn ? now.toDateString() : formattedDate}
        </p>
      </div>

      {/* 2. 4 Primary Metrics Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Metric 1: Học viên */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 hover:border-[#334155] transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9]/15 text-[#38BDF8]">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400">
            {isEn ? 'Students' : 'Học viên'}
          </p>
          <p className="mt-1 text-3xl font-extrabold font-heading text-white">
            {totalStudents}
          </p>
        </div>

        {/* Metric 2: Lớp học */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 hover:border-[#334155] transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400">
            {isEn ? 'Classes' : 'Lớp học'}
          </p>
          <p className="mt-1 text-3xl font-extrabold font-heading text-white">
            {totalClasses}
          </p>
        </div>

        {/* Metric 3: Còn phải thu */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 hover:border-[#334155] transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400">
            {isEn ? 'Pending Tuition' : 'Còn phải thu'}
          </p>
          <p className="mt-1 text-3xl font-extrabold font-heading text-white">
            0 đ
          </p>
        </div>

        {/* Metric 4: Buổi hôm nay */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 hover:border-[#334155] transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-400">
            {isEn ? 'Today Lessons' : 'Buổi hôm nay'}
          </p>
          <p className="mt-1 text-3xl font-extrabold font-heading text-white">
            {todayLessonsCount}
          </p>
        </div>
      </div>

      {/* 3. Status Notification / Alert Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 text-xs sm:text-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white">
            {isEn ? 'No urgent warnings' : 'Không có cảnh báo'}
          </span>
          <span className="text-slate-400 text-xs">
            {isEn
              ? 'All students have regular attendance and no overdue tuition.'
              : 'Chưa có học viên nào trong diện nguy cơ nghỉ học.'}
          </span>
        </div>
      </div>

      {/* 4. Lối tắt nhanh (Quick Shortcuts) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading text-white">
          {isEn ? 'Quick Shortcuts' : 'Lối tắt nhanh'}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickShortcuts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[#1E293B] bg-[#131E2B] p-4 text-center hover:border-[#0EA5E9]/50 hover:bg-[#162536] transition-all group active:scale-95"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B131E] ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Two-Column Lower Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Section (2 cols wide on lg) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Team / Staff Card */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white">
                {isEn ? 'Center Team • 1 member' : 'Đội ngũ trung tâm • 1 người'}
              </h3>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#1E293B] bg-[#0B131E] px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:border-[#334155] transition-colors"
              >
                <UserPlus className="h-3 w-3 text-[#38BDF8]" />
                <span>{isEn ? 'Invite' : 'Mời thành viên'}</span>
              </button>
            </div>

            {/* Member row */}
            <div className="flex items-center justify-between rounded-xl bg-[#0B131E] p-3 border border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9] text-xs font-bold text-white">
                  T
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Phú Thanh</p>
                  <p className="text-[10px] text-slate-400">gia-su@example.com</p>
                </div>
              </div>
              <span className="rounded-md bg-[#131E2B] px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-[#1E293B]">
                {isEn ? 'Owner' : 'Chủ trung tâm'}
              </span>
            </div>

            <Link
              href={`/${locale}/tutor#team`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#38BDF8] hover:underline"
            >
              <span>{isEn ? 'View all members' : 'Xem tất cả thành viên'}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Recent Classes Card */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white">
                {isEn ? 'Recent Classes' : 'Lớp học gần đây'}
              </h3>
              <Link
                href={`/${locale}/tutor#classes`}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {isEn ? 'All classes →' : 'Tất cả →'}
              </Link>
            </div>

            {classes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#1E293B] bg-[#0B131E] p-8 text-center">
                <p className="text-xs text-slate-400">
                  {isEn ? 'No classes yet.' : 'Chưa có lớp nào.'}
                </p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FF7A00] hover:bg-[#E56E00] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Create first class' : 'Tạo lớp đầu tiên'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between rounded-xl bg-[#0B131E] p-3 border border-[#1E293B] hover:border-[#334155] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]/15 text-[#38BDF8]">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{cls.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {cls.subject} • {cls.gradeLevel}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-300">
                      {cls.studentCount} {isEn ? 'students' : 'học viên'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section (1 col wide on lg): Subscription Plan & Help */}
        <div className="space-y-6">
          {/* Subscription Service Plan Card */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-white">
              <Sparkles className="h-4 w-4 text-[#FF7A00]" />
              <span>{isEn ? 'Subscription Plan' : 'Gói dịch vụ'}</span>
            </div>

            <div>
              <p className="text-3xl font-black font-heading text-white">Free</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>{isEn ? 'Expires:' : 'Ngày hết hạn:'}</span>
                  <span className="font-semibold text-slate-200">
                    {isEn ? 'Unlimited' : 'Không giới hạn'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{isEn ? 'Students:' : 'Học viên:'}</span>
                  <span className="font-semibold text-slate-200">
                    {totalStudents} / 15
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] p-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isEn ? 'Upgrade Plan' : 'Nâng cấp gói'}</span>
            </button>
          </div>

          {/* Quick Support & Floating Shortcuts */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#131E2B] p-5 space-y-3">
            <h4 className="text-xs font-bold text-white">
              {isEn ? 'Need Assistance?' : 'Cần trợ giúp nhanh?'}
            </h4>
            <p className="text-xs text-slate-400">
              {isEn
                ? 'Contact TyPusEnglish support team anytime for setup assistance.'
                : 'Đội ngũ hỗ trợ TyPusEnglish luôn sẵn sàng hỗ trợ thiết lập lớp học.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#0068FF] hover:bg-[#0055D4] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all"
              >
                <span>Hỗ trợ qua Zalo</span>
              </a>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0B131E] text-slate-300 hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
