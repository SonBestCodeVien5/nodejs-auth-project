# SỔ TAY KỸ THUẬT DỰ ÁN (TECHNICAL NOTES)
*Cập nhật lần cuối: Tuần 3 - Login Logic & System Architecture*

Tài liệu này tổng hợp các kiến thức cốt lõi, giải thích bản chất "Tại sao làm thế" cho dự án Node.js/MongoDB Authentication.

---

## 1. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

### 1.1. Single-Threaded vs Multi-Threaded
* **Node.js (Đơn luồng):**
    * Chỉ có 1 nhân viên duy nhất (Main Thread) xử lý mọi yêu cầu.
    * **Cơ chế:** Nhận yêu cầu -> Nếu cần chờ (DB/File) thì ném ra sau (Async) -> Quay lại nhận yêu cầu khác ngay.
    * **Ưu điểm:** Cực nhẹ (tốn ít RAM), chịu tải cao (xử lý hàng chục nghìn kết nối I/O cùng lúc). Phù hợp Web/API.
    * **Nhược điểm:** Dở tính toán nặng (CPU Bound). Nếu tính toán lâu, toàn bộ server bị treo.
* **Truyền thống (Đa luồng - Java/PHP cũ):**
    * Mỗi yêu cầu tạo ra 1 nhân viên riêng (Thread).
    * **Nhược điểm:** Tốn tài nguyên (RAM) để nuôi Thread. Dễ sập nếu quá tải (C10k problem).

### 1.2. Tại sao phải dùng `async/await`?
* Do Node.js chỉ có 1 luồng, nếu code chạy đồng bộ (Synchronous) khi gọi Database, luồng chính sẽ bị chặn (Block).
* **`await`**: Ra lệnh cho code hiện tại "dừng lại chờ kết quả", NHƯNG server Node.js thì **không dừng**. Nó rảnh tay để đi xử lý request của người dùng khác.
* -> Giúp hệ thống Non-blocking I/O.

### 1.3. Node.js trên Server đa nhân (Clustering)
* Node.js đơn luồng không lãng phí sức mạnh của Server 64 nhân.
* **Giải pháp:** Sử dụng kỹ thuật **Clustering** (hoặc PM2). Chạy 64 bản sao (Instances) của Node.js song song trên 64 nhân.

---

## 2. MÔI TRƯỜNG & CẤU HÌNH (ENVIRONMENT)

### 2.1. Live Server vs Node.js Server
* **Vấn đề:** Không thể dùng Extension "Live Server" cho file `.ejs`.
* **Lý do:** EJS là Web Động (Server-Side Rendering), cần Node.js biên dịch logic trước khi trả về trình duyệt. Live Server chỉ chạy HTML tĩnh.

### 2.2. Các lệnh khởi chạy (Scripts)
* **`npm start`**: Lệnh Production (`node app.js`).
* **`npm run dev`**: Lệnh Development (`nodemon app.js` - Tự động restart).

---

## 3. CẤU TRÚC MÃ NGUỒN (CODE STRUCTURE)

### 3.1. Mô hình MVC
* **Model:** Quản lý dữ liệu (Schema `User.js`).
* **View:** Giao diện (`register.ejs`, `login.ejs`).
* **Controller:** Xử lý logic (`authController.js`).
* **Routes:** Điều phối đường dẫn (`authRoutes.js`).

### 3.2. Import & Export
* **`module.exports = Router`**: Xuất nguyên kiện (Object duy nhất).
* **`exports.funcName = ...`**: Xuất lẻ từng hàm vào một Object chung.
* **Private Scope:** Các biến không export trong file thì file khác không thể truy cập (Tính đóng gói).

---

## 4. LOGIC BACKEND (DEEP DIVE)

### 4.1. Middleware & Body Parser
* `app.use(express.urlencoded)`: Bắt buộc để đọc dữ liệu từ Form HTML (`req.body`). Nếu thiếu, dữ liệu nhận được là `undefined`.
* `app.use` vs `app.get`:
    * `app.get('/')`: Chỉ khớp trang chủ (Exact match).
    * `app.use('/')`: Khớp mọi đường dẫn bắt đầu bằng `/` (Prefix match) -> Dùng để gắn Router hoặc Middleware.

### 4.2. Destructuring & Aliasing
* Khi lấy dữ liệu từ `req.body`, tên biến phải trùng với `name` bên HTML.
* Nếu muốn đổi tên, dùng cú pháp Alias:
  `const { email: taiKhoan } = req.body;`

### 4.3. HTTP Methods (GET vs POST)
* Server phân biệt dựa trên cặp **[METHOD] + [URL]**.
* **GET:** Hiển thị giao diện.
* **POST:** Xử lý dữ liệu ngầm (Login/Register).
* **Lưu ý:** Form HTML bắt buộc phải có `method="POST"`, nếu không sẽ mặc định là GET và lộ dữ liệu lên URL.

---

## 5. QUY TRÌNH XỬ LÝ (AUTH FLOW)

### 5.1. Đăng ký (Register)
1.  Nhận `req.body`.
2.  Kiểm tra trùng Email.
3.  **Hashing:** Dùng `bcrypt.hash` mã hóa mật khẩu (Tuyệt đối không lưu pass thô).
4.  Lưu vào MongoDB (`User.create`).

### 5.2. Đăng nhập (Login)
1.  Tìm User theo Email (`User.findOne`).
2.  **Compare:** Dùng `bcrypt.compare(pass_nhap, pass_db)` để so sánh.
3.  **Phản hồi:**
    * Nếu sai: Dùng `res.send` báo lỗi.
    * Nếu đúng: Dùng `res.redirect` chuyển hướng sang Dashboard (Trải nghiệm người dùng tốt hơn).

### 5.3. Session (Phiên làm việc - Đang triển khai)
* HTTP là giao thức không trạng thái (Stateless).
* Cần `express-session` để Server lưu thông tin người dùng sau khi đăng nhập thành công.
* Session ID được lưu trong Cookie trình duyệt.