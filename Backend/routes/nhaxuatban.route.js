const express = require("express");
const { addPublisher,getPublishers,updatePublisher,deletePublisher } = require("../controllers/nhaxuatban.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Lưu vào thư mục 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Sửa lỗi `file.filename` -> `file.originalname`
  },
});

const upload = multer({ storage });
router.post("/", upload.single("hinhanh"), addPublisher); // Thêm sách
router.get("/", getPublishers); // Lấy danh sách sách
router.patch("/:id", upload.single("hinhanh"), updatePublisher);
router.delete("/:id",deletePublisher);

module.exports = router;
