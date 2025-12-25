// controllers/apiController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Email không tồn tại'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Sai mật khẩu'});
        }

        // tạo token(jwt) 
        // payload: thông tin gói bên trong token
        const payload = {
            userId: user._id,
            role: user.role
        }

        // kí tên đóng dấu bằng JWT_SECRET
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' // token hết hạn trong 1 giờ
        });

        // trả về kết quả JSON
        res.json({
            message: 'Đăng nhập thành công',
            token: token, // client cần trả về cái này 
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Lỗi server: ' + error.message});
    }
};

// ... (Code login cũ ở trên giữ nguyên)

// Hàm mới: Lấy thông tin cá nhân (Chỉ dành cho ai có Token)
exports.getProfile = async (req, res) => {
    // Lúc này req.user đã có dữ liệu do Middleware gán vào
    res.json({
        message: 'Chào mừng bạn đến với khu vực VIP!',
        yourData: req.user, // Dữ liệu lấy từ trong Token ra
        secretInfo: 'Đây là dữ liệu mật chỉ admin/user đăng nhập mới thấy'
    });
};