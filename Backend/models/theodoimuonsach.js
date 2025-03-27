const mongoose = require("mongoose");

const theodoimuonsachSchema = new mongoose.Schema({
  madocgia: { type: String, required: true },
  masach: { type: String, required: true},
  ngaymuon: { type: Date, default: Date.now, required: true },
  ngaytra: {type: Date},
  trangthai: {type: String, required: true, default: "Chờ duyệt"}
});

const TheoDoiMuonSach = mongoose.model(
  "TheoDoiMuonSach",
  theodoimuonsachSchema
);
module.exports = TheoDoiMuonSach;
