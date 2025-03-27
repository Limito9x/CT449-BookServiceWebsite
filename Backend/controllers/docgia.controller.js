const bcrypt = require("bcryptjs");
const DocGia = require("../models/docgia");
const { formatDate, existPhoneRegister,checkPhoneUpdate } = require("../utils/tool.util");
const {validationResult} = require("express-validator");
// Đăng ký độc giả
exports.registerReader = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { tendocgia, dienthoai, matkhau } = req.body;
  try {
    if (await existPhoneRegister(dienthoai)) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);

    // Tách họ lót và tên
    let parts = tendocgia.trim().split(" "); // Tách chuỗi theo dấu cách

    if (parts.length === 1) {
      return { hoLot: "", ten: parts[0] }; // Nếu chỉ có 1 từ thì đó là tên
    }

    let ten = parts.pop(); // Lấy phần tử cuối làm tên
    let holot = parts.join(" "); // Ghép lại phần còn lại thành họ lót
    // Tạo độc giả mới
    const newDocGia = new DocGia({
      holot,
      ten,
      dienthoai,
      matkhau: hashedPassword,
    });
    await newDocGia.save();
    res
      .status(201)
      .json({ message: "Đăng ký độc giả thành công!", user: newDocGia });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tìm kiếm độc giả
exports.getReader = async (req, res) => {
  try {
    const Reader = await DocGia.findOne({ madocgia: req.params.id }).lean();

    if (!Reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

    const { matkhau, ...userData } = Reader;
    userData.ngaysinh = userData.ngaysinh
      ? formatDate(userData.ngaysinh)
      : "...";
    userData.hoten = `${userData.holot} ${userData.ten}`.trim();
    res.json({ userData });
  } catch (error) {
    console.error("Lỗi khi lấy độc giả:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// lấy danh sách độc giả
exports.getAllReaders = async (req, res) => {
  try {
    const readers = await DocGia.find().lean();
    const formattedReaders = readers.map((reader) => ({
      ...reader,
      ngaysinh: formatDate(reader.ngaysinh) || "", // Định dạng ngày sinh
      phai: reader.phai !== null ? (reader.phai ? "Nữ" : "Nam") : "", // Xử lý giới tính
      hoten: `${reader.holot} ${reader.ten}`.trim(),
    }));
    res.json(formattedReaders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách độc giả" });
  }
};
//Cập nhật độc giả
exports.updateReader = async (req, res) => {
  try {
    const { hoten,dienthoai } = req.body;
    if(! await checkPhoneUpdate(req.params.id,dienthoai)){
      return res.status(400).json({message: "Số điện thoại này được đăng ký!"})
    }
    let holot = "";
    let ten = hoten.trim();

    // Nếu có nhiều từ, tách họ lót và tên
    let parts = hoten.trim().split(/\s+/); // Chia theo khoảng trắng
    if (parts.length > 1) {
      ten = parts.pop();
      holot = parts.join(" ");
    }
    // Cập nhật dữ liệu
    const updatedReader = await DocGia.findOneAndUpdate(
      { madocgia: req.params.id },
      { ...req.body, holot, ten },
      { new: true, runValidators: true }
    );

    if (!updatedReader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    const userData = updatedReader.toObject();
    userData.hoten = `${userData.holot} ${userData.ten}`.trim();
    res.json({ message: "Cập nhật thành công!", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Xóa độc giả
exports.deleteReader = async (req, res) => {
  try {
    const deletedReader = await DocGia.findOneAndDelete({
      madocgia: req.params.id,
    });
    if (!deletedReader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    res.json({
      message: "Xóa tài khoản độc giả thành công!",
      user: deletedReader,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
