const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const nxbSchema = new mongoose.Schema({
  manxb: { type: String, required: true, unique: true, default: uuidv4 },
  tennxb: { type: String, required: true },
  diachi: { type: String },
  hinhanh: { type: String }, //Đường dẫn hình ảnh
});

const NhaXuatBan = mongoose.model("NhaXuatBan", nxbSchema);
module.exports = NhaXuatBan;
