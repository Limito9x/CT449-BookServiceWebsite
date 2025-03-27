const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const sachSchema = new mongoose.Schema({
  masach: { type: String, required: true, unique: true, default: uuidv4 },
  tensach: { type: String, required: true },
  dongia: { type: Number, required: true },
  soquyen: { type: Number, required: true },
  namxuatban: { type: Number },
  manxb: { type: String, required: true },
  tacgia: { type: String },
  hinhanh: { type: String }, //Đường dẫn hình ảnh
  goiy: {type: Boolean, default: false},
});

const Sach = mongoose.model("Sach", sachSchema);
module.exports = Sach;
