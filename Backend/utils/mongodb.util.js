const mongoose = require("mongoose");
const config = require("../config"); // Import config

const connectDB = async () => {
  try {
    console.log("🔍 Kết nối MongoDB với URI:", config.db.uri);
    await mongoose.connect(config.db.uri);
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
