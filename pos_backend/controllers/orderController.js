const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("table");
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid order ID"));
    }

    // Lấy toàn bộ dữ liệu cần cập nhật từ body
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // đảm bảo dữ liệu cập nhật hợp lệ
    });

    if (!updatedOrder) {
      return next(createHttpError(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};


const getOrderByTableId = async (req, res, next) => {
  try {
    const { tableId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return next(createHttpError(404, "Invalid tableId!"));
    }

    const order = await Order.findOne({
      table: tableId,
      orderStatus: { $in: ["Unpaid", "open"] },
    }).sort({ createdAt: -1 });

    if (!order) {
      return next(createHttpError(404, "No active order for this table!"));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const updateDishStatus = async (req, res, next) => {
  try {
    const { orderId, turn, dishId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(dishId)) {
      return next(createHttpError(400, "Invalid orderId or dishId"));
    }

    const order = await Order.findById(orderId).populate('items.items.dish');
    if (!order) {
      return next(createHttpError(404, "Order not found"));
    }

    const turnIndex = order.items.findIndex((t) => t.turn === Number(turn));
    if (turnIndex === -1) {
      return next(createHttpError(404, "Turn not found in order"));
    }

    const dishIndex = order.items[turnIndex].items.findIndex(
      (i) => i.dish._id.toString() === dishId
    );

    if (dishIndex === -1) {
      return next(createHttpError(404, "Dish not found in turn"));
    }

    order.items[turnIndex].items[dishIndex].status = status;
    order.markModified(`items.${turnIndex}.items.${dishIndex}.status`);
    await order.save();

    res.status(200).json({ success: true, message: "Dish status updated", data: order });
  } catch (error) {
    next(error);
  }
};




module.exports = { addOrder, getOrderById, getOrders, updateOrder, getOrderByTableId, updateDishStatus };