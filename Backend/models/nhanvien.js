const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const nhanvienSchema = new mongoose.Schema({
  msnv: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  hotennv: { type: String, required: true },
  chucvu: { type: String, required: true},
  diachi: { type: String },
  sodienthoai: {
    type: String,
    unique: true,
    required: true,
    match: [/^(0[1-9][0-9]{8})$/, "Số điện thoại không hợp lệ!"],
  },
  password: { type: String, required: true },
});

const NhanVien = mongoose.model("NhanVien", nhanvienSchema);
module.exports = NhanVien;
