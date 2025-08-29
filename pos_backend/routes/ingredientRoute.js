const express = require("express");
const {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  decreaseStock
} = require("../controllers/ingredientController");

const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

// Lấy danh sách nguyên liệu (có phân trang & tìm kiếm) + Tạo mới
router.route("/")
  .get(isVerifiedUser, getAllIngredients)
  .post(isVerifiedUser, createIngredient);

// Lấy, cập nhật, xoá theo ID
router.route("/:id")
  .get(isVerifiedUser, getIngredientById)
  .put(isVerifiedUser, updateIngredient)
  .delete(isVerifiedUser, deleteIngredient);

router.post("/decrease-stock", decreaseStock);

module.exports = router;
