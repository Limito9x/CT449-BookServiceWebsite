const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/mongodb.util");
const path = require("path");
const sachRoutes = require("./routes/sach.route");
const docgiaRoutes = require("./routes/docgia.route");
const authMiddleware = require("./routes/auth.route");
const nhanvienRoutes = require("./routes/nhanvien.route");
const theodoimuonsachRoutes = require("./routes/theodoimuonsach.route");
const nhaxuatbanRoutes = require("./routes/nhaxuatban.route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Kết nối MongoDB
connectDB();

// Định tuyến
app.use("/sach", sachRoutes);
app.use("/docgia",docgiaRoutes);
app.use("/auth", authMiddleware);
app.use("/nhanvien",nhanvienRoutes);
app.use("/muonsach",theodoimuonsachRoutes);
app.use("/nxb",nhaxuatbanRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
