Chúc mừng bạn! 🎉 Việc nhìn thấy tên mình trên Dashboard và F5 không bị "văng" ra ngoài chính là cột mốc đánh dấu bạn đã chinh phục được kỹ thuật quản lý phiên làm việc (Session Management).

Dưới đây là nội dung cập nhật mới nhất cho file **`docs/WORK_LOG.md`**. Tôi đã đánh dấu hoàn thành cho các mục Session và Dashboard. Bạn hãy copy toàn bộ nội dung dưới đây và dán đè vào file cũ nhé.

---

# NHẬT KÝ PHÁT TRIỂN DỰ ÁN (WORK LOG)

## Tuần 1: Khởi tạo & Nền tảng (Foundation)

### 1. Thiết lập Môi trường & Cấu trúc
- [x] **Cài đặt công cụ:** Node.js (LTS), MongoDB Community Server, MongoDB Compass, VS Code.
- [x] **Khởi tạo dự án:** `npm init`, cài đặt `express`, `mongoose`, `ejs`, `dotenv`, `bcrypt`, `express-session`.
- [x] **Cấu trúc MVC:** Tổ chức folder `models`, `views`, `controllers`, `routes`.

### 2. Kết nối Database
- [x] **Cấu hình:** File `.env` và `config/database.js`.
- [x] **Model:** Tạo Schema `User` (username, email, password, role).

### 3. Giao diện (Frontend)
- [x] **Views:** Tạo `home.ejs`, `register.ejs`, `login.ejs` với Bootstrap 5.

---

## Tuần 2: Logic Đăng ký (Register Logic)

- [x] **Controller:** Xử lý `register`: Hash password (`bcrypt`), tạo user mới trong DB.
- [x] **Route:** Phân tách GET/POST cho trang đăng ký.
- [x] **Middleware:** Cấu hình `body-parser` để đọc dữ liệu Form.

---

## Tuần 3: Đăng nhập & Quản lý Phiên (Login & Session)
*Thời gian thực hiện: 08/12/2025 - 12/12/2025*

### 1. Logic Đăng nhập cơ bản (Backend)
- [x] **Kiểm tra thông tin:**
  - Tìm User theo email.
  - So sánh mật khẩu bằng `bcrypt.compare`.
- [x] **Luồng xử lý:**
  - Sai thông tin -> Báo lỗi.
  - Đúng thông tin -> (Trước đây) Chuyển về Home -> (Mới cập nhật) Chuyển về Dashboard.

### 2. Cấu hình Session ("Bộ nhớ" Server)
- [x] **Cài đặt:** Kiểm tra thư viện `express-session`.
- [x] **Cấu hình `app.js`:**
  - Thiết lập `app.use(session(...))` **trước** phần Routes.
  - Cấu hình bảo mật: `httpOnly: true`.
  - Cấu hình `maxAge`: 1 giờ.
- [x] **Bảo mật:** Đưa `SESSION_SECRET` vào file `.env` để tránh lộ khóa bí mật.

### 3. Dashboard & Logic Bảo vệ (Protection)
- [x] **Giao diện:** Tạo `views/dashboard.ejs` hiển thị thông tin User lấy từ Session.
- [x] **Cập nhật Controller:**
  - Hàm `login`: Lưu thông tin User (`id`, `username`, `role`) vào `req.session.user` khi đăng nhập thành công.
  - Hàm `getDashboard`: Kiểm tra thủ công `if (req.session.user)` -> Cho vào, `else` -> Đá về Login.
- [x] **Router:** Đăng ký route `GET /dashboard`.

### 4. Kết quả kiểm thử (Testing)
- [x] **Happy Case:** Đăng nhập đúng -> Vào Dashboard -> F5 (Refresh) vẫn giữ đăng nhập (Session hoạt động tốt).
- [x] **Security Case:**
  - Truy cập `/dashboard` khi chưa login -> Bị chuyển hướng về `/login`.
  - Tab ẩn danh không vào được Dashboard.

### 5. Việc tồn đọng & Kế hoạch tiếp theo (Next Steps)
- [ ] **Middleware tách biệt:** Chuyển logic kiểm tra session từ Controller ra một file Middleware riêng (`isAuthenticated`) để tái sử dụng cho nhiều trang khác.
- [ ] **Chức năng Đăng xuất (Logout):** Xóa session và chuyển hướng về trang Login.
- [ ] **Phân quyền (Authorization):** Chỉ cho Admin vào trang quản lý User.

---

**Ghi chú kỹ thuật ngày 12/12:**
* Đã hiểu rõ luồng dữ liệu của Middleware: `app.use` -> `req.body`, `req.session`.
* Đã nắm được cơ chế `httpOnly` để chống XSS (JavaScript không đọc được cookie) và `secret` để chống sửa đổi Cookie.
* Dự án đang chạy theo mô hình **Server-Side Rendering (SSR)** (Node.js render EJS).