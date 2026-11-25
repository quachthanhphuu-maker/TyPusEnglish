# TyPusEnglish

> Bộ công cụ song ngữ, đa môn học dành cho gia sư độc lập, giáo viên và người tự học Tiếng Anh.

---

## 📖 Tài Liệu Dự Án (Documentation)

Dự án tuân thủ nghiêm ngặt mô hình **Documentation-Driven Development** và **Agent-Assisted Development**. Toàn bộ quy chuẩn và yêu cầu kỹ thuật được lưu trữ trong thư mục [`docs/`](docs/):

* **[AGENTS.md](AGENTS.md)** — Quy tắc bắt buộc và hướng dẫn thực thi dành cho AI Agent.
* **[docs/PRD.md](docs/PRD.md)** — Bản mô tả yêu cầu sản phẩm gốc (Source of Truth v1.0).
* **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Kiến trúc Modular Monolith, ranh giới các module và luồng xử lý.
* **[docs/DATABASE.md](docs/DATABASE.md)** — Thiết kế mô hình dữ liệu PostgreSQL, Prisma schema và chính sách lưu trữ.
* **[docs/SECURITY.md](docs/SECURITY.md)** — Chính sách bảo mật, ma trận phân quyền (`can` policy) và kiểm soát tệp tin.
* **[docs/FRONTEND.md](docs/FRONTEND.md)** — Kiến trúc Frontend, Sitemap, Design System và tầng Mock Service (Frontend-First).
* **[docs/I18N.md](docs/I18N.md)** — Quy chuẩn quốc tế hóa (Tiếng Việt & Tiếng Anh) với `next-intl`.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

* **Framework:** Next.js (App Router, Server Actions, Server Components)
* **Ngôn ngữ:** TypeScript
* **Giao diện:** Tailwind CSS + Radix UI (qua **shadcn/ui**)
* **Đa ngôn ngữ:** `next-intl` (Vi/En)
* **Form & Validation:** React Hook Form + Zod
* **Cơ sở dữ liệu & ORM:** PostgreSQL + Prisma (cho giai đoạn Backend)
* **Xác thực:** Auth.js (Email Magic Links)
* **Kiểm thử:** Vitest, Playwright

---

## 🚀 Hướng Dẫn Phát Triển (Development Setup)

### 1. Cài đặt phụ thuộc
```bash
npm install
# hoặc
pnpm install
```

### 2. Chế độ Frontend-First (với Mock Service)
Dự án hỗ trợ chạy độc lập không cần cơ sở dữ liệu để hoàn thiện giao diện người dùng:
```bash
# Tạo file môi trường mẫu
cp .env.example .env.local

# Bật chế độ Mock Service
NEXT_PUBLIC_USE_MOCK=true
```

Khởi chạy máy chủ phát triển:
```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 📋 Kiểm Tra & Xác Minh (Verification)
Trước khi tạo Pull Request hoặc hoàn tất task, chạy các bước kiểm tra theo [AGENTS.md](AGENTS.md):
```bash
npm run lint       # Kiểm tra lỗi cú pháp code
npm run typecheck  # Kiểm tra kiểu TypeScript
npm run test       # Chạy unit & integration tests
npm run build      # Xác nhận build thành công
```
