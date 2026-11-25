import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | TyPusEnglish',
  description: 'How TyPusEnglish handles account and authentication data.',
};

const policy = {
  en: {
    title: 'Privacy Policy',
    back: 'Back to TyPusEnglish',
    draft: 'Development draft. The project owner must review and complete the contact, retention, deletion, and student-data sections before public launch or Google OAuth verification.',
    updated: 'Draft prepared November 25, 2026',
    sections: [
      {
        title: 'Account information',
        body: 'TyPusEnglish processes the username and email address you provide. Passwords are stored as password hashes, not as plain text. If you sign in with Google, the app receives your Google account identifier and basic profile information such as your name and email address.',
      },
      {
        title: 'Email verification and password reset',
        body: 'If you authorize a Gmail sender account, TyPusEnglish requests the Gmail send permission (gmail.send) to send account verification and password reset messages. The app does not use this permission to read your inbox. Verification and reset links contain single-use tokens; the database stores a hash of each token and the link expires after 15 minutes.',
      },
      {
        title: 'Security and storage',
        body: 'The app maintains session and rate-limit records to protect accounts. During local development, account data is held in the project’s PostgreSQL database running on the developer’s computer. Production hosting, retention periods, and deletion procedures have not yet been finalized.',
      },
      {
        title: 'Tutor and learner information',
        body: 'TyPusEnglish is designed to support tutor-managed learner profiles and learning records. Before using the public service with real student or minor data, the project owner must publish complete information about what records are collected, who can access them, how long they are retained, and how requests are handled.',
      },
      {
        title: 'Contact and policy updates',
        body: 'A privacy contact address and account-data deletion instructions must be added by the project owner before this draft is used as a public policy. This policy will need to be updated when production hosting or data practices change.',
      },
    ],
    draftLabel: 'Policy status',
  },
  vi: {
    title: 'Chính sách quyền riêng tư',
    back: 'Quay lại TyPusEnglish',
    draft: 'Bản dự thảo cho môi trường phát triển. Chủ dự án cần rà soát và hoàn thiện thông tin liên hệ, thời hạn lưu trữ, xóa dữ liệu và dữ liệu học sinh trước khi công khai hoặc gửi Google xét duyệt OAuth.',
    updated: 'Dự thảo ngày 25 tháng 11, 2026',
    sections: [
      {
        title: 'Thông tin tài khoản',
        body: 'TyPusEnglish xử lý tên đăng nhập và địa chỉ email bạn cung cấp. Mật khẩu được lưu dưới dạng giá trị băm, không lưu văn bản thuần. Nếu đăng nhập bằng Google, ứng dụng nhận mã tài khoản Google và thông tin hồ sơ cơ bản như tên và email.',
      },
      {
        title: 'Xác minh email và đặt lại mật khẩu',
        body: 'Nếu bạn cấp quyền cho hộp thư Gmail gửi thư, TyPusEnglish chỉ yêu cầu quyền gửi Gmail (gmail.send) để gửi thư xác minh tài khoản và đặt lại mật khẩu. Ứng dụng không dùng quyền này để đọc hộp thư. Liên kết xác minh và đặt lại chứa token dùng một lần; cơ sở dữ liệu chỉ lưu giá trị băm của token và liên kết hết hạn sau 15 phút.',
      },
      {
        title: 'Bảo mật và lưu trữ',
        body: 'Ứng dụng duy trì bản ghi phiên đăng nhập và giới hạn tần suất để bảo vệ tài khoản. Trong quá trình phát triển local, dữ liệu tài khoản nằm trong PostgreSQL chạy trên máy phát triển. Nơi lưu trữ production, thời hạn lưu dữ liệu và quy trình xóa dữ liệu chưa được hoàn thiện.',
      },
      {
        title: 'Thông tin gia sư và người học',
        body: 'TyPusEnglish được thiết kế để hỗ trợ hồ sơ người học do gia sư quản lý và các dữ liệu học tập. Trước khi dùng dịch vụ công khai với dữ liệu thật của học sinh hoặc trẻ vị thành niên, chủ dự án cần công bố đầy đủ loại dữ liệu được thu thập, người có quyền truy cập, thời hạn lưu trữ và cách xử lý yêu cầu của người dùng.',
      },
      {
        title: 'Liên hệ và cập nhật chính sách',
        body: 'Chủ dự án cần bổ sung email liên hệ về quyền riêng tư và hướng dẫn xóa dữ liệu tài khoản trước khi dùng bản dự thảo này làm chính sách công khai. Chính sách cần được cập nhật khi nơi lưu trữ production hoặc cách xử lý dữ liệu thay đổi.',
      },
    ],
    draftLabel: 'Trạng thái chính sách',
  },
};

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  const content = params.locale === 'en' ? policy.en : policy.vi;

  return (
    <main className="min-h-screen bg-[#F8FBFF] px-4 py-12 text-[#1B2A38] sm:px-6">
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <Link href={`/${params.locale}`} className="text-sm font-semibold text-sky-700 underline underline-offset-2">
          {content.back}
        </Link>
        <h1 className="mt-6 text-3xl font-bold">{content.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{content.updated}</p>
        <section aria-label={content.draftLabel} className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>{content.draftLabel}: </strong>{content.draft}
        </section>
        <div className="mt-8 space-y-7">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 leading-7 text-slate-700">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
