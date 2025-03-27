const bcrypt = require("bcryptjs");
const {
  existPhoneRegister,
  checkPhoneUpdate,
} = require("../utils/tool.util");

const { body,validationResult } = require("express-validator");
const NhanVien = require("../models/nhanvien");

// Thêm nhân viên
exports.addStaff = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { hotennv, dienthoai: sodienthoai, matkhau } = req.body;
  try {
    if (await existPhoneRegister(sodienthoai)) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);

    // Tạo nhân viên mới
    const newNhanVien = new NhanVien({
      hotennv,
      sodienthoai,
      chucvu: "Nhân viên",
      password: hashedPassword,
    });
    await newNhanVien.save();

    res
      .status(201)
      .json({ message: "Đăng ký nhân viên thành công!", user: newNhanVien });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tìm kiếm nhân viên
exports.getStaff = async (req, res) => {
  try {
    const staff = await NhanVien.findOne({
      msnv: req.params.id,
    });
    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({
      message: "Tìm kiếm tài khoản nhân viên thành công!",
      user: staff,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// lấy danh sách nhân viên
exports.getAllStaffs = async (req,res) => {
  try {
    const staffs = await NhanVien.find();
    res.json(staffs);
  }
  catch(error){
    res.status(500).json({message: "Lỗi khi lấy danh sách nhân viên"});
  }
}
//Cập nhật nhân viên
exports.updateStaff = async (req, res) => {
  try {
    const updatedStaff = await NhanVien.findOneAndUpdate({msnv: req.params.id},
      req.body,
      {new: true, runValidators: true}
    );
    if(!updatedStaff) {
      return res.status(404).json({ message:"Không tìm thấy nhân viên"})
    }
    res.json({ message: "Cập nhật thành công!", user: updatedStaff });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Xóa nhân viên
exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await NhanVien.findOneAndDelete(
      { maNhanVien: req.params.id }
    );
    if (!deletedStaff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({ message: "Xóa tài khoản nhân viên thành công!", user: deletedStaff });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};