const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories
} = require("../controllers/categoryController"); // đổi đúng path nếu cần

const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/").get(isVerifiedUser, getCategories);
router.route("/").post(isVerifiedUser, createCategory);
router.route("/:id").delete(isVerifiedUser, deleteCategory);
router.route("/:id").put(isVerifiedUser, updateCategory);

module.exports = router;
