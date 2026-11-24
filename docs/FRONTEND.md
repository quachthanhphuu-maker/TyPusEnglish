# TyPusEnglish — Frontend Architecture & UI/UX Specification

Tài liệu hướng dẫn phát triển Frontend theo phương pháp **Frontend-First**, cho phép xây dựng và kiểm thử toàn bộ giao diện độc lập trước khi hoàn thiện cơ sở dữ liệu và Backend.

Dựa trên: [PRD.md](PRD.md) (v1.0), [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md).

---

## 1. Sitemap & Route Map (Next.js App Router)

Ứng dụng chia làm 4 không gian người dùng (Portals) và khu vực chung (Public/Auth). Mọi route đều nằm dưới locale `/[locale]/...` (xem [I18N.md](I18N.md)).

```
app/[locale]/
├── (auth)/
│   ├── login/                        # Đăng nhập bằng Email Magic Link
│   ├── register/                     # Public Tutor / Independent Learner registration
│   ├── onboarding/                   # Choose first self-service workspace
│   ├── workspace/                    # Select and switch among authorized roles
│   ├── verify-request/               # Thông báo đã gửi magic link
│   └── invite/                       # Classes-owned invitation acceptance routes
│
├── (portals)/
│   ├── tutor/                        # Portal dành cho Gia sư / Giáo viên
│   │   ├── dashboard/                # Lịch dạy trong ngày, nhắc việc học phí & bài tập
│   │   ├── classes/                  # Danh sách lớp (1-1, nhóm nhỏ)
│   │   │   ├── new/                  # Tạo lớp mới (môn học, khối lớp)
│   │   │   └── [classId]/
│   │   │       ├── overview/         # Sĩ số, hồ sơ học sinh, lời mời phụ huynh
│   │   │       ├── lessons/          # Điểm danh, nhật ký buổi học, ghi chú riêng
│   │   │       ├── assignments/      # Giao bài, theo dõi nộp bài, chấm điểm
│   │   │       ├── tuition/          # Thu học phí, ghi nhận thanh toán/hoàn tiền
│   │   │       └── reports/          # Tạo & xuất bản báo cáo định kỳ cho phụ huynh
│   │   └── assessments/              # Ngân hàng đề thi thủ công (Exams & Questions)
│   │
│   ├── student/                      # Portal dành cho Học sinh có tài khoản
│   │   ├── classes/                  # Các lớp đang tham gia
│   │   ├── assignments/              # Danh sách bài tập cần làm & đã nộp
│   │   │   └── [assignmentId]/       # Giao diện làm bài / xem kết quả đã công bố
│   │   └── results/                  # Điểm số và nhận xét đã xuất bản
│   │
│   ├── parent/                       # Portal dành cho Phụ huynh
│   │   ├── children/                 # Danh sách các con đã liên kết
│   │   └── reports/[reportId]/       # Báo cáo học tập chính thức (Read-only, snapshot)
│   │
│   └── self-study/                   # Không gian Tự học Tiếng Anh độc lập (Free)
│       ├── vocabulary/               # Bộ từ vựng cá nhân, tạo & import từ
│       ├── flashcards/               # Ôn tập Spaced Repetition (Lặp lại ngắt quãng)
│       └── progress/                 # Thống kê chuỗi ngày học (Streaks) & mục tiêu ngày
│
└── tools/                            # Công cụ giảng dạy & Mô phỏng (P1/P2)
    └── simulations/                  # Mô phỏng hình học 3D, Vật lý, Hóa học
```

Every portal has a server layout that checks the matching account role.
The selected workspace is a stored display preference only; the server checks
the account's current role on every portal request.
The shared locale layout uses an Auth.js `SessionProvider` to refresh session
state hourly and when the browser regains focus; protected layouts still read
the revocable database session and current roles on the server.

---

## 2. Design System & Theming

* **Framework:** Tailwind CSS kết hợp Radix UI thông qua **shadcn/ui**.
* **Triết lý:** Gọn gàng, chuẩn giáo dục, tối ưu độ tương phản, thân thiện trên màn hình di động cho phụ huynh và tối ưu thao tác nhanh cho gia sư trên máy tính.

### A. Bảng màu chủ đạo (Color Palette)
* **Primary (Chủ đạo):** Deep Emerald / Slate Teal (`hsl(160, 84%, 39%)`) — Thể hiện sự chuẩn mực, học thuật, dễ chịu cho mắt khi làm việc lâu.
* **Secondary / Accent:** Warm Amber / Gold (`hsl(38, 92%, 50%)`) — Nhấn mạnh điểm số, streak tự học, trạng thái quan trọng.
* **Semantic Colors:**
  * Success (`emerald-600`): Có mặt (Present), Đã nộp đúng hạn, Đã thanh toán (Paid).
  * Warning (`amber-500`): Đi muộn (Late), Nộp muộn, Thanh toán một phần (Partially paid).
  * Destructive (`rose-600`): Vắng mặt (Absent), Quá hạn (Overdue), Thu hồi liên kết (Revoked).
  * Neutral/Muted (`slate-500`): Có phép (Excused), Chưa nộp (Not submitted), Chưa chấm (Ungraded).

### B. Typography & Accessibility
* **Font chữ:** `Inter` hoặc `Be Vietnam Pro` (Google Fonts) hỗ trợ dấu tiếng Việt chuẩn xác, hiển thị sắc nét ở kích thước nhỏ trên thiết bị di động.
* **Kích thước & Khoảng cách:** Base 16px, đảm bảo chuẩn WCAG AA về tương phản chữ trên nền tối/sáng.

---

## 3. Component Architecture

Tuân thủ nguyên tắc phân tách trách nhiệm trong Next.js App Router:

```
src/
├── components/
│   ├── ui/                           # Primitive shadcn/ui components (Button, Dialog, Table...)
│   ├── shared/                       # Thành phần dùng chung toàn app (Header, LanguageSwitcher, EmptyState...)
│   └── feedback/                     # Skeleton, ErrorBoundary, LoadingSpinner
│
└── modules/                          # Feature-based Components
    ├── accounts/components/          # LoginForm, UserProfileMenu
    ├── classes/components/           # ClassCard, StudentProfileModal, InviteParentDialog
    ├── lessons/components/           # AttendanceTable, LessonNoteEditor
    ├── assessments/components/       # QuestionBankCard, ExamEditor, SubmissionViewer
    ├── tuition/components/           # TuitionChargeForm, PaymentRecordDialog, BalanceSummary
    ├── reports/components/           # ReportSnapshotPreview, ParentReportCard
    └── self-study/components/        # FlashcardPlayer, StreakCounter, VocabularyList
```

### Server Components vs Client Components
* **Mặc định là Server Component (RSC):** Render trang, bố cục layout, nạp dữ liệu ban đầu từ Service/Mock layer, xử lý SEO và i18n metadata.
* **Sử dụng Client Component (`"use client"`):**
  * Tương tác form (React Hook Form + Zod).
  * Dialog / Modal / Popover / Dropdown Menu.
  * Trình lật thẻ flashcard và tương tác kéo thả.
  * Bảng điểm danh hàng loạt cần toggle trạng thái tức thì.

---

## 4. State Management

1. **URL State (Single Source of Truth cho bộ lọc & phân trang):**
   * Sử dụng search params của Next.js (`useSearchParams`) hoặc thư viện `nuqs`.
   * Ví dụ: `/tutor/classes/[id]/lessons?month=2026-11&status=ABSENT`.
2. **Server State & Mutation:**
   * Tương tác dữ liệu bằng **Next.js Server Actions**.
   * Quản lý trạng thái form bằng React 19 `useActionState` và `useOptimistic` (hỗ trợ phản hồi tức thì cho điểm danh và đánh dấu bài tập).
3. **Client Local State:**
   * React `useState` / `useReducer` cho các trạng thái giao diện cục bộ (mở modal, lật thẻ từ vựng).

---

## 5. Mock Data & Service Layer (Hỗ trợ Frontend-First)

Để Frontend có thể phát triển và chạy thử 100% mà không cần kết nối PostgreSQL:

### A. Chuẩn hóa Hợp đồng Dịch vụ (Service Contract)
Mỗi module định nghĩa một Interface độc lập với hạ tầng:

```typescript
// src/modules/classes/contracts/class-service.ts
export interface IClassService {
  getClassById(classId: string): Promise<ClassDetailDTO | null>;
  listTutorClasses(tutorId: string): Promise<ClassSummaryDTO[]>;
  createClass(input: CreateClassInput): Promise<ActionResult<ClassDetailDTO>>;
}
```

### B. Mock Adapter & In-Memory Storage
```typescript
// src/modules/classes/services/class-mock-service.ts
export class MockClassService implements IClassService {
  // Mock data sẵn có, lưu bộ nhớ tạm hoặc LocalStorage
}
```

### C. Công tắc môi trường (Feature Toggle)
Trong `src/lib/service-factory.ts`:
* Nếu `process.env.NEXT_PUBLIC_USE_MOCK === "true"`: Trả về `MockClassService`.
* Khi Backend sẵn sàng: Chuyển sang `PrismaClassService` mà không cần viết lại giao diện Frontend.

Authentication does not use `NEXT_PUBLIC_USE_MOCK`. Business mock services
remain available in development and are disabled in production. Mock data or
mock roles never bypass the server-side session and role checks.

### D. Public Auth Contract

`src/modules/accounts/contracts/auth-contract.ts` is the public-safe contract.
It deliberately omits session tokens and sensitive database fields:

```ts
type UserRole = 'tutor' | 'student' | 'parent' | 'independent_learner';
interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  roles: UserRole[];
  onboardingStatus: 'NOT_STARTED' | 'COMPLETE';
  activeWorkspace: UserRole | null;
}
interface SessionDTO { user: UserDTO; expiresAt: string; }
type AuthStatus =
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; session: SessionDTO };
```

The former single-role `UserSession.role` has been replaced by
`UserDTO.roles[]`; the compatibility alias `UserSession` points to `UserDTO`
and does not retain a singular `role` property. Update consumers to handle
zero, one, or multiple roles.

Server APIs include `getAuthStatus()`, `requireWorkspaceAccess(role, locale)`,
`can(actor, action, resource)` (deny by default), and
`grantVerifiedInvitationRole(tx, userId, role)`. Server Actions expose
`completeOnboardingAction`, `addWorkspaceAction`, `selectWorkspaceAction`,
and `logoutAction`. Classes calls the invitation role grant only after it
validates and redeems its invitation and links the existing profile inside
the same transaction.

Invitation acceptance routes and persistence belong to the Classes module.
They are not implemented by Accounts because this branch has no Classes
invitation model or service to validate recipient, scope, expiry, revocation,
single-use state, or profile linking. Until that integration is available,
Student and Parent role activation remains unavailable in real authentication;
mock business services remain usable only in development.

The localized Auth.js error route is `app/[locale]/auth/error/`, a sibling of
the `(auth)` route group. Invitation routes shown in the sitemap are owned by
Classes and need to be added when its invitation service is implemented.

Safe error codes are `INVALID_EMAIL`, `RATE_LIMITED`, `LINK_INVALID`,
`LINK_EXPIRED`, `INVITATION_INVALID`, `SESSION_EXPIRED`, `UNAUTHENTICATED`,
`FORBIDDEN`, and `INTERNAL_ERROR`. Do not return Auth.js or database error
messages to the browser.

After sign-in, zero roles go to `/${locale}/onboarding`; one role goes to its
portal; multiple roles use `/${locale}/workspace` unless a still-authorized
last workspace is remembered. Redirect targets must remain same-origin and
under the requested locale. The workspace selector always remains available
for switching.

---

## 6. Responsive Design & Thiết bị mục tiêu

* **Desktop (min-width: 1024px):**
  * Tối ưu cho **Gia sư (Tutor)**: Bảng điểm danh dạng bảng lớn (Grid/Table), trình soạn bài tập & ngân hàng đề thi 2 cột.
* **Mobile / Tablet (max-width: 768px):**
  * Tối ưu cho **Phụ huynh (Parent) & Học sinh (Student)**: Giao diện thẻ cuộn dọc (Cards), nút bấm tối thiểu 44x44px, xem báo cáo học tập rõ ràng, làm bài tập trên điện thoại.
  * Tối ưu cho **Tự học (Self-Study)**: Vuốt thẻ Flashcard mượt mà trên màn hình cảm ứng.

---

## 7. Loading, Error & Empty States

Mỗi thư mục route bắt buộc chuẩn bị 3 trạng thái giao diện tiêu chuẩn:

1. **Loading State (`loading.tsx`):**
   * Sử dụng Skeleton UI khớp với layout của trang thật (ví dụ: Skeleton hàng bảng cho buổi học, Skeleton thẻ cho danh sách lớp). Tránh dùng spinner che toàn màn hình.
2. **Error State (`error.tsx`):**
   * Thông báo lỗi rõ ràng bằng 2 ngôn ngữ, cung cấp nút "Thử lại" (`reset()`) và nút quay về Dashboard.
   * Che giấu chi tiết lỗi nhạy cảm của server theo [SECURITY.md](SECURITY.md).
3. **Empty State:**
   * Khi lớp chưa có học sinh, chưa có buổi học, hoặc ngân hàng đề trống: Hiển thị hình minh họa thân thiện, thông điệp hướng dẫn rõ ràng và nút kêu gọi hành động (CTA) trực tiếp (ví dụ: *"Chưa có buổi học nào. [Tạo buổi học đầu tiên]"*).
