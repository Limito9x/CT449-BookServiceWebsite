const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const docgiaSchema = new mongoose.Schema({
  madocgia: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  holot: { type: String, required: true },
  ten: { type: String, required: true },
  ngaysinh: { type: Date },
  phai: { type: Boolean },
  diachi: { type: String },
  dienthoai: {
    type: String,
    unique: true,
    required: true,
    match: [/^(0[1-9][0-9]{8})$/, "Số điện thoại không hợp lệ!"],
  },
  matkhau: { type: String, required: true },
});

const DocGia = mongoose.model("DocGia", docgiaSchema);
module.exports = DocGia;
