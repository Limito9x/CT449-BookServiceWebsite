const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Load biến môi trường từ .env
const DocGia = require("../models/docgia");
const NhanVien = require("../models/nhanvien")
const secretKey = process.env.SECRET_KEY;
const {formatDate} = require("../utils/tool.util");

exports.login = async (req, res) => {
  const { dienthoai, matkhau } = req.body;
  try {
    let user = await DocGia.findOne({ dienthoai: dienthoai });
    let type = "docgia";
    let hashedPasswordField = "matkhau";
    if (!user) {
      user = await NhanVien.findOne({sodienthoai: dienthoai}) 
      if(user) {
        user.chucvu === "Quản trị viên"
          ? (type = "admin")
          : (type = "nhanvien");
        hashedPasswordField = "password";
      }
      else return res.status(400).json({ message: "SDT không tồn tại" });
    }
    const isMatch = await bcrypt.compare(matkhau, user[hashedPasswordField]);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }
    const token = jwt.sign(
      { id: user._id, type }, // Dữ liệu trong token
      secretKey, // Khóa bí mật (cần bảo mật)
      { expiresIn: "1h" } // Hết hạn sau 1 giờ
    );
    const { matkhau: mkdg, password: mknv, ...userData } = user.toObject(); //Loại bỏ mật khẩu khi gửi về
    userData.ngaysinh = formatDate(userData.ngaysinh);
    res.json({ token, userData, type });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Middleware xác thực token
exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ Header
  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Giải mã token
    req.user = decoded; // Gán thông tin user vào req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// Middleware kiểm tra quyền truy cập (Linh hoạt hơn)
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.type)) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập!" });
      }
    next();
  };
};
