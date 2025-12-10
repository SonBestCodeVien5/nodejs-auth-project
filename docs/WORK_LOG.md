# NHẬT KÝ PHÁT TRIỂN DỰ ÁN (WORK LOG)

## Tuần 1: Khởi tạo & Nền tảng (Foundation)

### 1. Thiết lập Môi trường & Cấu trúc
- [x] **Cài đặt công cụ:** Node.js (LTS), MongoDB Community Server, MongoDB Compass, VS Code.
- [x] **Khởi tạo dự án:**
  - Chạy `npm init -y` tạo `package.json`.
  - Cài đặt thư viện lõi: `express`, `mongoose`, `ejs`, `dotenv`, `bcrypt`.
  - Cài đặt công cụ Dev: `nodemon` (để Hot Reload).
- [x] **Cấu trúc thư mục MVC:** Tổ chức folder chuẩn: `models`, `views`, `controllers`, `routes`, `config`.

### 2. Kết nối Database
- [x] **Cấu hình:** Tạo file `.env` chứa `MONGO_URI` và `PORT`. Thêm `.env` vào `.gitignore` để bảo mật.
- [x] **Code kết nối:** Viết module `config/database.js` sử dụng `mongoose.connect` với `async/await`.
- [x] **Mô hình hóa (Model):** Tạo `models/User.js` định nghĩa Schema User (username, email, password, role) với các validation (required, unique).

### 3. Xây dựng Giao diện (Frontend)
- [x] **View Engine:** Cấu hình EJS trong `app.js`.
- [x] **Tạo Views:** Tạo 3 file giao diện sử dụng Bootstrap 5:
  - `home.ejs`: Trang chủ điều hướng.
  - `register.ejs`: Form đăng ký (Method: POST, Action: /register).
  - `login.ejs`: Form đăng nhập (Method: POST, Action: /login).

---

## Tuần 2: Xử lý Logic Đăng ký (Register Logic)

### 1. Triển khai MVC (Model - View - Controller) cho tính năng Đăng ký
- [x] **Controller (`authController.js`):**
  - Viết hàm `register` xử lý bất đồng bộ.
  - Nhận dữ liệu từ `req.body`.
  - Kiểm tra trùng lặp Email (`User.findOne`).
  - **Mã hóa mật khẩu:** Sử dụng `bcrypt.hash` trước khi lưu vào DB.
  - Lưu user mới (`User.create`).
- [x] **Router (`authRoutes.js`):**
  - Tách biệt route `GET /register` (hiện form) và `POST /register` (xử lý).
  - Sử dụng `express.Router()` và gắn vào `app.js`.
- [x] **Middleware:**
  - Kích hoạt `express.urlencoded` trong `app.js` để đọc dữ liệu từ Form HTML.

### 2. Gỡ lỗi & Kiểm thử
- [x] **Khắc phục lỗi:** Sửa lỗi Validation `role: 'User'` (do viết hoa) thành `'user'` (viết thường) để khớp với Schema.
- [x] **Kết quả:** Đăng ký thành công -> Dữ liệu vào MongoDB (password đã mã hóa) -> Web chuyển hướng sang trang Login.

---

## Tuần 3: Logic Đăng nhập (Login Logic)
*Trạng thái: Đang thực hiện Giai đoạn 1*

### 1. Xây dựng Logic Đăng nhập (Backend)
- [x] **Cập nhật Controller (`authController.js`):**
  - Xây dựng hàm `login` xử lý phương thức POST.
  - Sử dụng `User.findOne` để tìm tài khoản theo email.
  - Sử dụng `bcrypt.compare` để so sánh mật khẩu nhập vào (plain text) với mật khẩu trong DB (hashed).
  - Xử lý luồng lỗi: Dùng `res.send` báo lỗi nếu sai Email hoặc Password.
  - Xử lý luồng đúng: `console.log` thông báo thành công và `res.redirect` về trang chủ.

- [x] **Cập nhật Router (`authRoutes.js`):**
  - Khai báo route `router.post('/login')` để đón dữ liệu từ Form Login.

### 2. Kiểm thử (Manual Testing)
- [x] **Test Case Sai:** Nhập sai thông tin -> Server chặn lại và báo lỗi.
- [x] **Test Case Đúng:** Nhập đúng thông tin -> Server cho phép đi qua và chuyển hướng.

### 3. Việc tồn đọng (Pending Tasks)
- [ ] **Session:** Cấu hình `express-session` để Server "nhớ" trạng thái đăng nhập.
- [ ] **Dashboard:** Tạo trang quản trị dành riêng cho user đã đăng nhập.
- [ ] **Middleware:** Viết hàm `isAuthenticated` để bảo vệ các route riêng tư.