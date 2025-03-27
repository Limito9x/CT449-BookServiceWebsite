const express = require("express");
const { addBook, getBook ,getBooks, updateBook, deleteBook } = require("../controllers/sach.controller");
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
router.post("/", upload.single("hinhanh"), addBook); // Thêm sách
router.get("/", getBooks); // Lấy danh sách sách
router.get("/:id", getBook); // Lấy 1 sách
router.patch("/:id", upload.single("hinhanh"), updateBook);
router.delete("/:id",deleteBook);

module.exports = router;
