const Dish = require("../models/dishModel");
const Category = require("../models/categoryModel");

exports.createDish = async (req, res) => {
    const {
        name,
        price,
        tax,
        category,
        description,
        image,
        isAvailable = true,
        ingredients = [],
        type,
    } = req.body;

    try {
        const newDish = await Dish.create({
            name,
            price,
            tax,
            category,
            description,
            image,
            isAvailable,
            ingredients,
            type,
        });

        // Cập nhật danh mục: thêm món vào mảng `dishes`
        await Category.findByIdAndUpdate(category, {
            $push: { dishes: newDish._id },
        });

        res.status(201).json(newDish);
    } catch (error) {
        res.status(500).json({ message: "Thêm món thất bại", error: error.message });
    }
};


exports.getDishes = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10, category = "" } = req.query;

        const query = {
            ...(search && { name: { $regex: search, $options: "i" } }),
            ...(category && { category }),
        };

        const dishes = await Dish.find(query)
            .populate("category")
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Dish.countDocuments(query);

        res.json({ dishes, totalPages: Math.ceil(total / limit), totalItems: total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id).populate("category");
        if (!dish) return res.status(404).json({ message: "Dish not found" });
        res.json(dish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/dishes/by-ids
exports.getDishesByIds = async (req, res) => {
    try {
      const { ids } = req.body;
  
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "ids must be an array" });
      }
  
      const dishes = await Dish.find({ _id: { $in: ids } });
  
      res.json({ dishes });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

exports.updateDish = async (req, res) => {
    try {
        const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedDish) return res.status(404).json({ message: "Dish not found" });
        res.json(updatedDish);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDish = async (req, res) => {
    try {
      const dishId = req.params.id;
  
      // Xoá dish
      const deleted = await Dish.findByIdAndDelete(dishId);
      if (!deleted) {
        return res.status(404).json({ message: "Dish not found" });
      }
  
      // Xoá dish khỏi tất cả các danh mục có chứa nó
      await Category.updateMany(
        { dishes: dishId },
        { $pull: { dishes: dishId } }
      );
  
      res.json({ message: "Dish deleted and removed from related categories" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
