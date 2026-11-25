# Cấu hình email Gmail và Google Sign-In / Gmail Email and Google Sign-In Setup

## Tiếng Việt

### Database

Ứng dụng tiếp tục dùng PostgreSQL qua Prisma. PostgreSQL trong Docker trên máy cá nhân là database thật và lưu dữ liệu; Mailpit chỉ là hộp thư giả lập. Tích hợp này không đổi schema hay migration.

### Google Sign-In

1. Trong Google Cloud Console, tạo OAuth client loại **Web application**.
2. Thêm JavaScript origin `http://localhost:3000` và callback `http://localhost:3000/api/auth/callback/google`.
3. Điền client ID/secret vào `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `frontend/.env.local`.

### Gửi thư bằng Gmail API

1. Dùng một OAuth client riêng loại **Web application** cho hộp thư Gmail gửi thư.
2. Bật Gmail API, cấu hình OAuth consent screen loại External ở trạng thái Testing, thêm chính hộp thư gửi làm test user, và khai báo scope duy nhất `https://www.googleapis.com/auth/gmail.send`.
3. Thêm callback `http://127.0.0.1:8787/oauth2callback` vào OAuth client gửi thư.
4. Điền `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` và `GMAIL_SENDER_EMAIL` trong `frontend/.env.local`. Địa chỉ gửi phải là hộp thư đã cấp quyền.
5. Trong thư mục `frontend`, chạy `pnpm gmail:connect`, mở URL được in ra, đăng nhập đúng hộp thư gửi và chấp thuận quyền gửi thư. Công cụ local nhận callback và lưu refresh token vào `.env.local`; token không được in ra terminal.
6. Khởi động lại app bằng `pnpm run dev`. Đăng ký một tài khoản thử nghiệm để xác nhận email xác minh đến hộp thư thật.

Khi consent screen External còn ở Testing, chỉ test user được thêm mới cấp quyền được. Refresh token cho scope Gmail hết hạn sau 7 ngày, nên chạy lại `pnpm gmail:connect` khi cần cấp quyền mới. Không gửi client secret hay refresh token qua chat hoặc commit chúng vào Git.

Trang `/vi/privacy` và `/en/privacy` hiện là bản dự thảo. Trước khi đưa OAuth ra production, chủ dự án cần có domain đã xác minh, hoàn thiện thông tin liên hệ/lưu trữ/xóa dữ liệu trên chính sách, công khai trang này, và gửi Google xét duyệt scope nhạy cảm `gmail.send`. Zalo chưa được bật trong cấu hình local này.

## English

### Database

The app continues to use PostgreSQL through Prisma. The local Docker PostgreSQL instance is a real persistent database; Mailpit only simulates an inbox. This integration does not change the schema or migrations.

### Google Sign-In

1. In Google Cloud Console, create an OAuth client of type **Web application**.
2. Add JavaScript origin `http://localhost:3000` and callback `http://localhost:3000/api/auth/callback/google`.
3. Put the client ID and secret in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `frontend/.env.local`.

### Send mail with Gmail API

1. Use a separate **Web application** OAuth client for the Gmail sender mailbox.
2. Enable Gmail API, configure an External OAuth consent screen in Testing, add the sender mailbox as a test user, and request only `https://www.googleapis.com/auth/gmail.send`.
3. Add `http://127.0.0.1:8787/oauth2callback` as an authorized redirect URI for the sender client.
4. Set `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_SENDER_EMAIL` in `frontend/.env.local`. The sender address must be the mailbox that grants authorization.
5. From `frontend`, run `pnpm gmail:connect`, open the printed URL, sign into the sender mailbox, and grant send permission. The local helper receives the callback and stores the refresh token in `.env.local` without printing it.
6. Restart the app with `pnpm run dev` and register a test account to confirm delivery to a real inbox.

While an External consent screen is in Testing, only listed test users can grant access. Gmail-scope refresh tokens expire after 7 days, so rerun `pnpm gmail:connect` when authorization expires. Never send client secrets or refresh tokens in chat or commit them to Git.

The `/vi/privacy` and `/en/privacy` pages are drafts. Before production OAuth, the project owner must verify a domain, complete the contact/retention/deletion details, publish the policy page, and submit the sensitive `gmail.send` scope for Google review. Zalo is not enabled in this local setup.
