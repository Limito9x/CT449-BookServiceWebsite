const TheoDoiMuonSach = require("../models/theodoimuonsach");
const DocGia = require("../models/docgia");
const Sach = require("../models/sach");
const {formatTime} = require("../utils/tool.util")

exports.borrowRequest = async (req, res) => {
  const { madocgia, masach } = req.body;
  try {
    const book = await Sach.findOne({masach});
    if (!book) return res.status(404).json({ message: "Sách không tồn tại!" });
    const existingBookCard = await TheoDoiMuonSach.findOne({
      madocgia,
      masach,
      trangthai: { $ne: "Đã trả" },
    });
    if(existingBookCard) {
      if (existingBookCard.trangthai === "Chờ duyệt")
        return res.status(400).json({ message: "Sách đang chờ duyệt!" });
      if (existingBookCard.trangthai === "Đang mượn")
        return res.status(400).json({
          message: "Bạn đang mượn sách này, không thể gửi yêu cầu mượn!",
        });
    }
    if(book.soquyen===0) return res.status(400).json({ message: "Số lượng sách đã hết!" });
    const bookCard = new TheoDoiMuonSach({
      madocgia,
      masach,
    });
    await bookCard.save();
    book.soquyen--;
    await book.save();
    res.status(201).json({ message: "Đã tạo yêu cầu mượn sách" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.borrowGetAll = async (req, res) => {
  try {
    const bookCards = await TheoDoiMuonSach.find();
    //Tìm các độc giả có trong phiếu mượn
    const readerIDs = bookCards.map((card) => card.madocgia);
    const readers = await DocGia.find({ madocgia: { $in: readerIDs } });
    //Tìm các quyển sách có trong phiếu mượn
    const bookIDs = bookCards.map((card) => card.masach);
    const books = await Sach.find({ masach: { $in: bookIDs } });

    const readerMap = {};
    readers.forEach((reader) => {
      readerMap[reader.madocgia] = {
        hoten: `${reader.holot} ${reader.ten}`.trim(),
        dienthoai: reader.dienthoai,
      };
    });

    const bookMap = {};
    books.forEach((book) => {
      bookMap[book.masach] = {
        tensach: book.tensach,
      };
    });

    const formattedBookCard = bookCards.map((card) => ({
      _id: card._id,
      hoten: readerMap[card.madocgia].hoten || "Không rõ",
      dienthoai: readerMap[card.madocgia].dienthoai || "Không có số SDT",
      tensach: bookMap[card.masach].tensach || "Sách không tồn tại",
      trangthai: card.trangthai,
      ngaymuon: formatTime(card.ngaymuon),
      ngaytra: formatTime(card.ngaytra),
    }));
    res.json(formattedBookCard);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.borrowGetOne = async (req, res) => {
  const madocgia = req.params.id;
  try {
    const bookCards = await TheoDoiMuonSach.find({ madocgia: madocgia });
    if (!bookCards)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn!" });

    const bookIDs = bookCards.map((card) => card.masach);
    const books = await Sach.find({ masach: { $in: bookIDs } });
    const bookMap = {};
    books.forEach((book) => {
      bookMap[book.masach] = {
        tensach: book.tensach,
      };
    });
    const formattedBookCard = bookCards.map((card) => ({
      _id: card._id,
      tensach: bookMap[card.masach].tensach || "Sách không tồn tại",
      trangthai: card.trangthai,
      ngaymuon: formatTime(card.ngaymuon),
      ngaytra: formatTime(card.ngaytra),
    }));
    res.json(formattedBookCard);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.borrowUpdate = async (req, res) => {
  const id = req.params.id;
  const  {trangthai}  = req.body;
  try {
    if (!trangthai) {
      return res.status(404).json({ message: "Trạng thái không hợp lệ!" });
    }
    const bookCard = await TheoDoiMuonSach.findById(id);
    if (!bookCard)
      return res.status(404).json({ message: "Phiếu mượn không tồn tại!" });
    bookCard.trangthai = trangthai;
    if (trangthai === "Đang mượn") {
      bookCard.ngaymuon = Date.now();
      res.status(200).json({ message: "Sách đã được duyệt" });
    } else if (trangthai === "Đã trả") {
      bookCard.ngaytra = Date.now();
      const book = await Sach.findOne({masach:bookCard.masach});
      book.soquyen++;
      book.save();
      res.status(200).json({ message: "Sách đã được trả" });
    }
    await bookCard.save();
    return res;
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.borrowDelete = async (req, res) => {
  const id = req.params.id;
  try {
    const bookCard = await TheoDoiMuonSach.findByIdAndDelete(id);
    if (!bookCard) return res.status(404).json({ message: "Phiếu mượn không tồn tại!" });
    const book = await Sach.findOne({masach: book.masach})
    book.soquyen++;
    await book.save();
    return res.json({ message: "Đã từ chối yêu cầu mượn!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};
