const express = require('express'); // khởi tạo express từ package đã cài
const app = express(); // khởi tạo app từ express

require('dotenv').config(); // Đọc file .env
const connectDB = require('./config/database'); // Gọi file cấu hình DB

const authRoutes = require('./routes/authRoutes'); // Gọi các route liên quan đến xác thực

connectDB(); // Thực hiện kết nối ngay lập tức tới DB

const port = process.env.PORT || 3000; // nếu không có PORT trong .env thì dùng 3000

// --- 2. MIDDLEWARE CƠ BẢN ---
app.use(express.urlencoded({ extended: true })); // xử lý dữ liệu form gửi lên
app.use(express.json()); // xử lý dữ liệu json gửi lên

// Thiết lập EJS làm view engine
app.set('view engine', 'ejs'); // sử dụng ejs làm view engine lấy từ package đã cài
app.set('views', './views'); // thư mục chứa file ejs

// --- 3. ROUTES ---
app.get('/', (req, res) => { // get phải giống hệt là '/'
  res.render('home'); // Tìm file views/home.ejs
});

app.use('/', authRoutes); // Sử dụng các route liên quan đến xác thực
                          // chỉ xét bắt đầu của route thỏa mãn '/'
                          
// --- 4. KHỞI ĐỘNG SERVER ---
app.listen(port, () => {
  console.log(`Server đang chạy tại: http://localhost:${port}`);
  console.log('Nhấn Ctrl+C để tắt server');
});