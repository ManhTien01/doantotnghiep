const Ingredient = require("../models/ingredientModel");
const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
exports.createIngredient = async (req, res) => {
  const { name, type, quantity, category, unit } = req.body;

  try {
    // Tạo nguyên liệu mới
    const ingredient = new Ingredient({ name, type, quantity, category, unit });
    await ingredient.save();

    // Thêm nguyên liệu vào danh mục nếu có category
    if (category) {
      await Category.findByIdAndUpdate(category, {
        $push: { ingredients: ingredient._id },
      });
    }

    res.status(201).json(ingredient);
  } catch (err) {
    res.status(400).json({
      message: "Tạo nguyên liệu thất bại",
      error: err.message,
    });
  }
};


// Lấy danh sách nguyên liệu với phân trang và tìm kiếm
exports.getAllIngredients = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, type = "" } = req.query;

    const query = {
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(type && { type }), // Lọc theo loại: 'count' hoặc 'weight'
    };

    const ingredients = await Ingredient.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Ingredient.countDocuments(query);

    res.json({
      ingredients,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách nguyên liệu", error: err.message });
  }
};

// Lấy 1 nguyên liệu theo ID
exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tìm nguyên liệu", error: err.message });
  }
};

// Cập nhật nguyên liệu
exports.updateIngredient = async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy nguyên liệu để cập nhật" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
};

// Xoá nguyên liệu
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredientId = req.params.id;

    // Xoá nguyên liệu
    const deleted = await Ingredient.findByIdAndDelete(ingredientId);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu để xoá" });
    }

    // Xoá nguyên liệu khỏi tất cả category có chứa nó
    await Category.updateMany(
      { ingredients: ingredientId },
      { $pull: { ingredients: ingredientId } }
    );

    res.json({ message: "Xoá nguyên liệu thành công và đã cập nhật danh mục liên quan" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá nguyên liệu", error: err.message });
  }
};

// Trừ tồn kho nguyên liệu theo danh sách món đã bán
exports.decreaseStock = async (req, res) => {
  const { items } = req.body; // [{ dishId, quantity }]

  try {
    for (const { dishId, quantity } of items) {
      const dish = await Dish.findById(dishId).populate("ingredients.ingredient");

      if (!dish) {
        return res.status(404).json({ message: `Không tìm thấy món ăn với ID: ${dishId}` });
      }

      for (const ing of dish.ingredients) {
        const ingredient = await Ingredient.findById(ing.ingredient._id);
        const totalNeeded = ing.amount * quantity;

        if (!ingredient) {
          return res.status(404).json({ message: `Không tìm thấy nguyên liệu: ${ing.ingredient.name}` });
        }

        // Kiểm tra tồn kho
        if (ingredient.quantity < totalNeeded) {
          return res.status(400).json({
            message: `Nguyên liệu không đủ: ${ingredient.name}. Cần ${totalNeeded} nhưng chỉ còn ${ingredient.quantity}`,
          });
        }

        // Trừ tồn kho
        ingredient.quantity -= totalNeeded;
        await ingredient.save();
      }
    }

    res.status(200).json({ message: "Đã trừ tồn kho nguyên liệu thành công!" });
  } catch (err) {
    console.error("Lỗi khi trừ nguyên liệu:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi trừ nguyên liệu", error: err.message });
  }
};

