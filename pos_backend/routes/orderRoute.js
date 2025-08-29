const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, getOrderByTableId, updateDishStatus } = require("../controllers/orderController")
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();


router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);
router.route("/by-table/:tableId").get(isVerifiedUser, getOrderByTableId);
// router.route("/:orderId/turns/:turn/items/:dishId").put(isVerifiedUser, updateDishStatus);
router.route("/:orderId/turns/:turn/items/:dishId").put(updateDishStatus);

module.exports = router;