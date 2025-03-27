const DocGia = require("../models/docgia");
const NhanVien = require("../models/nhanvien");
const { body, validationResult } = require("express-validator");
// Kiểm tra số điện thoại đăng ký

exports.validateRegister = [
  body("dienthoai")
    .matches(/^(0[1-9][0-9]{8})$/)
    .withMessage("Số điện thoại không hợp lệ!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

exports.formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Khi cập nhật số điện thoại kiểm tra xem số điện thoại có hợp lệ không
exports.checkPhoneUpdate = async (id, sdt) => {
  try {
    // Tìm độc giả có dùng số điện thoại đó
    let user = await DocGia.findOne({ dienthoai: sdt });
    if (user) {
      return user.madocgia === id; // Nếu đúng thì số điện thoại không thay đổi
      //Ngược lại đã có độc giả sử dụng số điện thoại
    }
    // Nếu không tìm được độc giả ta tìm nhân viên
    else user = await NhanVien.findOne({ sodienthoai: sdt });
    if (user) {
      return user.msnv === id; //số điện thoại không thay đổi
      // Ngược lại đã có nhân viên sử dụng số điện thoại
    }
    return true; // Số điện thoại này chưa có người đăng ký
  } catch (error) {
    console.error("Lỗi khi kiểm tra số điện thoại:", error);
    return false; // Trả về false nếu có lỗi
  }
};

// Khi đăng ký số điện thoại kiểm tra xem số điện thoại đã có người đăng ký chưa
exports.existPhoneRegister = async (sdt) => {
  try {
    let user = await Promise.all([
      DocGia.findOne({ dienthoai: sdt }),
      NhanVien.findOne({ sodienthoai: sdt }),
    ]);
    if (user[0] || user[1]) return true;
    return false;
  } catch (error) {
    console.error("Lỗi khi kiểm tra số điện thoại:", error);
    return true; // Trả về true nếu có lỗi (Hủy quá trình đăng ký)
  }
};
