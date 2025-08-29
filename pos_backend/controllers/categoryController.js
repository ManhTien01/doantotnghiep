const Category = require('../models/categoryModel');

// Thêm danh mục mới
const createCategory = async (req, res) => {
  try {
    const { name, isMenu, menuType, price } = req.body;

    // Kiểm tra trùng tên
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Danh mục đã tồn tại.' });
    }

    // Nếu là menu thì kiểm tra menuType
    if (isMenu && !menuType) {
      return res.status(400).json({ message: 'Vui lòng chọn kiểu menu (alacart, buffet hoặc combo).' });
    }

    // Nếu menuType là buffet hoặc combo thì cần có giá
    if (isMenu && (menuType === 'buffet' || menuType === 'combo') && (price === undefined || price < 0)) {
      return res.status(400).json({ message: 'Vui lòng nhập giá hợp lệ cho buffet hoặc combo.' });
    }

    const newCategory = new Category({
      name: name.trim(),
      isMenu: Boolean(isMenu),
      menuType: isMenu ? menuType : undefined,
      price: isMenu && (menuType === 'buffet' || menuType === 'combo') ? price : undefined,
    });

    await newCategory.save();

    res.status(201).json({ message: 'Tạo danh mục thành công', data: newCategory });
  } catch (error) {
    console.error('Lỗi tạo danh mục:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo danh mục', error });
  }
};

const getCategories = async (req, res) => {
  const { search = "", page = 1, limit = 10, type, menuType } = req.query;

  const query = {
    name: { $regex: search, $options: "i" }
  };

  if (type === "menu") {
    query.isMenu = true;
  } else if (type === "ingredient" || type === "material") {
    query.isMenu = false;
  }

  // Lọc thêm theo menuType nếu có
  if (menuType) {
    query.menuType = menuType; // "buffet", "combo", hoặc "alacart"
  }

  try {
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ categories, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục", error: error.message });
  }
};


// Sửa danh mục
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, isMenu, menuType, price } = req.body;

    // Nếu là menu nhưng không có menuType thì báo lỗi
    if (isMenu && !menuType) {
      return res.status(400).json({ message: 'Vui lòng chọn kiểu menu (alacart, buffet hoặc combo).' });
    }

    // Nếu menuType là buffet hoặc combo thì cần có giá
    if (isMenu && (menuType === 'buffet' || menuType === 'combo') && (price === undefined || price < 0)) {
      return res.status(400).json({ message: 'Vui lòng nhập giá hợp lệ cho buffet hoặc combo.' });
    }

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: name?.trim(),
        isMenu: Boolean(isMenu),
        menuType: isMenu ? menuType : undefined,
        price: isMenu && (menuType === 'buffet' || menuType === 'combo') ? price : undefined,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    res.json({ message: 'Cập nhật danh mục thành công', data: updated });
  } catch (error) {
    console.error('Lỗi cập nhật danh mục:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục', error });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục để xóa' });
    }

    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xóa danh mục', error });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
