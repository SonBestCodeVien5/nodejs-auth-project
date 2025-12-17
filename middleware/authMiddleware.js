// middleware/authMiddleware.js
// đây là file middleware để kiểm tra xác thực người dùng
 
exports.isAuthenticated = (req, res, next) => {
    // kiểm tra có thẻ session hợp lệ không
    if(req.session && req.session.user){
        // đã đăng nhập, cho phép tiếp tục
        // next() để chuyển sang middleware hoặc route handler tiếp theo
        return next();
    } else{
        // chưa có thẻ, chuyển hướng về trang đăng nhập
        return res.redirect('/login');
    }
};