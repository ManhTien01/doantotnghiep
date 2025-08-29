const Area = require('../models/areaModel'); // đường dẫn tùy theo cấu trúc project

// Thêm khu vực mới
const createArea = async (req, res) => {
  try {
    const { area } = req.body;

    // Kiểm tra trùng tên
    const existing = await Area.findOne({ area });
    if (existing) {
      return res.status(400).json({ message: 'Khu vực đã tồn tại.' });
    }

    const newArea = new Area({ area });
    await newArea.save();

    res.status(201).json({ message: 'Tạo khu vực thành công', data: newArea });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tạo khu vực', error });
  }
};

// ✅ Lấy danh sách area
const getAreas = async (req, res, next) => {
  try {
    const areas = await Area.find();
    res.status(200).json({ success: true, data: areas });
  } catch (error) {
    next(error);
  }
};

// Sửa tên khu vực
const updateArea = async (req, res) => {
  try {
    const areaId = req.params.id;
    const { area } = req.body;

    const updated = await Area.findByIdAndUpdate(
      areaId,
      { area },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy khu vực' });
    }

    res.json({ message: 'Cập nhật khu vực thành công', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật khu vực', error });
  }
};

// Xóa khu vực
const deleteArea = async (req, res) => {
  try {
    const areaId = req.params.id;

    const deleted = await Area.findByIdAndDelete(areaId);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy khu vực để xóa' });
    }

    res.json({ message: 'Đã xóa khu vực thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xóa khu vực', error });
  }
};

module.exports = {
  getAreas,
  createArea,
  updateArea,
  deleteArea
};
