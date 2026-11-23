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
│   ├── verify-request/               # Thông báo đã gửi magic link
│   └── invite/
│       ├── student/[token]/          # Chấp nhận lời mời tham gia lớp học
│       └── parent/[token]/           # Xác nhận liên kết phụ huynh - học sinh
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
