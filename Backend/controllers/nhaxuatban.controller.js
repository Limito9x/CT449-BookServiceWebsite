const NhaXuatBan = require("../models/nhaxuatban");

// Thêm nhà xuất bản mới
exports.addPublisher = async (req, res) => {
  try {
    //Tạo đối tượng chứa dữ liệu cơ bản
    const publisherData = { ...req.body };
    if (req.file) {
      publisherData.hinhanh = `/uploads/${req.file.filename}`; //Nếu có hình thì thêm src hình
    }
    const newpublisher = new NhaXuatBan(publisherData);
    await newpublisher.save();
    res.status(201).json({ message: "Thêm nhà xuất bản thành công!", publisher: newpublisher });
  } catch (error) {
    console.error("❌ Lỗi khi thêm nhà xuất bản:", error);
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách nhà xuất bản
exports.getPublishers = async (req, res) => {
  try {
    const publishers = await NhaXuatBan.find();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh nhà xuất bản nhà xuất bản!" });
  }
};

//Cập nhật nhà xuất bản
exports.updatePublisher = async (req, res) => {
  try {
    const publisher = await NhaXuatBan.findOne({ manxb: req.params.id });
    if (!publisher) return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    const updateData = { ...req.body };
    if (req.file) {
      updateData.hinhanh = `/uploads/${req.file.filename}`; //Nếu có hình thì thêm src hình
    } else updateData.hinhanh = publisher.hinhanh;
    const updatedPublisher = await NhaXuatBan.findOneAndUpdate(
      { manxb: req.params.id }, // Điều kiện tìm kiếm
      { $set: updateData }, // Dữ liệu cập nhật
      { new: true, runValidators: true }
    );
    if (!updatedPublisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.json({ message: "Cập nhật nhà xuất bản thành công!"});
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật nhà xuất bản:", error);
    res.status(400).json({ message: error.message });
  }
};

//Xóa nhà xuất bản
exports.deletePublisher = async (req, res) => {
  try {
    const deleted = await NhaXuatBan.findOneAndDelete({ manxb: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.json({ message: "Xóa nhà xuất bản thành công!", publisher: deleted });
  } catch (error) {
    console.error("❌ Lỗi khi xóa nhà xuất bản:", error);
    res.status(400).json({ message: error.message });
  }
};
