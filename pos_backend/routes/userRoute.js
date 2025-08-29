const express = require("express")
const { register, login, getUserData, logout, getAllUsers, updateUser, deleteUser } = require("../controllers/userController")
const { isVerifiedUser } = require("../middlewares/tokenVerification")
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
// Lấy thông tin user hiện tại
router.route("/me").get(isVerifiedUser, getUserData);

// Lấy danh sách user, phân trang, tìm kiếm
router.route("/").get(isVerifiedUser, getAllUsers);

// Cập nhật user theo id
router.route("/:id").put(isVerifiedUser, updateUser);
router.route("/:id").delete(isVerifiedUser, deleteUser);

module.exports = router
