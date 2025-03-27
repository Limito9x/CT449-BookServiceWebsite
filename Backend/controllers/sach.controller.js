const Sach = require("../models/sach");
const NXB = require("../models/nhaxuatban");

// Thêm sách mới
exports.addBook = async (req, res) => {
  try {
    //Tạo đối tượng chứa dữ liệu cơ bản
    const bookData = { ...req.body };
    if(req.file) {
      bookData.hinhanh = `/uploads/${req.file.filename}`; //Nếu có hình thì thêm src hình
    }
    const newBook = new Sach(bookData);
    await newBook.save();
    res.status(201).json({ message: "Thêm sách thành công!", book: newBook });
  } catch (error) {
    console.error("❌ Lỗi khi thêm sách:", error);
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách sách
exports.getBooks = async (req, res) => {
  try {
    const books = await Sach.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách!" });
  }
};

// Lấy 1 sách
exports.getBook = async (req, res) => {
  try {
    const book = await Sach.findOne({masach: req.params.id});
    const nxb = await NXB.findOne({manxb: book.manxb});
    const bookData = book.toObject();
    bookData.tennxb=nxb.tennxb;
    res.json(bookData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách!" });
  }
};

//Cập nhật sách
exports.updateBook = async (req, res) => {
  try {
     const book = await Sach.findOne({ masach: req.params.id });
     if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    const updateData = {...req.body};
    if (req.file) {
      updateData.hinhanh = `/uploads/${req.file.filename}`; //Nếu có hình thì thêm src hình
    }
    else updateData.hinhanh = book.hinhanh;
    const updatedBook = await Sach.findOneAndUpdate(
      { masach: req.params.id }, // Điều kiện tìm kiếm
      { $set: updateData }, // Dữ liệu cập nhật
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.json({ message: "Cập nhật sách thành công!", book: updatedBook });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật sách:", error);
    res.status(400).json({ message: error.message });
  }
};

//Xóa sách
exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Sach.findOneAndDelete({ masach: req.params.id });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.json({ message: "Xóa sách thành công!", book: deleted });
  } catch (error) {
    console.error("❌ Lỗi khi xóa sách:", error);
    res.status(400).json({ message: error.message });
  }
};
