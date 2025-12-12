// controllers/authController.js
// đây là file controller xử lí các yêu cầu liên quan đến xác thực
// gọi các mô đun cần thiết
const User = require('../models/User'); // mô hình người dùng
const bcrypt = require('bcrypt'); // để băm mật khẩu => chuỗi hash 

// các hàm xử lí đăng kí
exports.register = async(req, res) => {
    try {
        // bước A: nhận dữ liệu từ người dùng 
            // req.body chứa dữ liệu nhập trong form tại trang register
        const { username, email, password } = req.body; // destructure để lấy 3 trường cần thiết
                                                        // 3 trường từ form phải đúng tên như này

        // console.log("Dữ liệu nhận được từ form đăng kí:", req.body); 
        // ------------------------------ bật khi debug -----------------------------

        // bước B: kiểm tra email đã dùng chưa
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.send('Lỗi: Email này đã được đăng ký!');
        }

        // bước C: băm mật khẩu
            // tạo chuỗi ngẫu nhiên (salt) độ dài 10 ký tự
        const salt = await bcrypt.genSalt(10);
            // băm mật khẩu với salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // bước D: tạo người dùng mới trong CSDL
        await User.create({
            username: username,
            email: email,
            password: hashedPassword, // lưu mật khẩu đã băm, TUYẾT ĐỐI KHÔNG LƯU MẬT KHẨU THÔ
            role: 'user'        
        });

        // bước E: phản hồi về client
        console.log('✅ Đã tạo user thành công: ' + username);
        res.redirect('/login'); // chuyển hướng về trang đăng nhập

    } catch (error){
        console.error(error);
        res.send('Có lỗi xảy ra: ' + error.message);
    }
};

// hàm xử lí đăng nhập
exports.login = async(req, res) => {
    try {
        // bước A: nhận dữ liệu từ người dùng
        const {email, password} = req.body; // truòng email và password từ form phải chính xác

        // 2. Tìm xem email này có trong kho không?
        const user = await User.findOne({email: email});

        // Nếu không tìm thấy user -> Báo lỗi
        if(!user){
            return res.send("Lỗi: Email chưa được đăng ký!");
        }

        // 3. So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong CSDL
        // bcrypt.compare(pass_nhập_vào, pass_đã_mã_hóa_trong_DB)
        const isMatch = await bcrypt.compare(password, user.password);

        // Nếu không khớp -> Báo lỗi
        if(!isMatch){
            return res.send("Lỗi: Mật khẩu không đúng!");
        }

        // cấp quyền đăng nhập, tạo session, cookie
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Nếu khớp hết -> Đăng nhập thành công
        console.log("✅ Đăng nhập thành công:", user.username);

        // tạm thời chưa làm session, cookie gì cả
        // đăng nhập thành công thì chuyển hướng về trang chủ
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.send("Lỗi hệ thống: " + error.message);
    }
};

// hàm hiển thị trang đăng kí
exports.getRegisterPage = (req, res) => {
    res.render('register'); // hiển thị trang register.ejs
}

// hàm hiển thị trang đăng nhập
exports.getLoginPage = (req, res) => {
    res.render('login'); // hiển thị trang login.ejs
};

// hàm hiển thị trang dashboard (dành cho user đã đăng nhập)
exports.getDashboard = (req, res) => {
    // kiểm tra kho session xem có user không
    if(req.session.user){
        // có thẻ: cho phép hiển thị dashboard
        res.render('dashboard', {user: req.session.user});
    } else {
        // không thẻ: chuyển hướng về trang đăng nhập
        res.redirect('/login');
    }
}