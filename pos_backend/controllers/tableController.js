const Table = require("../models/tableModel");
const Area = require("../models/areaModel");
const Order = require("../models/orderModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

// ✅ Thêm bàn
const addTable = async (req, res, next) => {
  try {
    const { tableNo, seats, area } = req.body;

    if (!tableNo || !seats || !area) {
      return next(createHttpError(400, "Thiếu thông tin bàn!"));
    }

    const isExist = await Table.findOne({ tableNo });
    if (isExist) {
      return next(createHttpError(400, "Số bàn đã tồn tại!"));
    }

    const newTable = new Table({ tableNo, seats, area });
    await newTable.save();

    await Area.findByIdAndUpdate(area, { $addToSet: { tables: newTable._id } });

    res.status(201).json({ success: true, message: "Thêm bàn thành công!", data: newTable });
  } catch (error) {
    next(error);
  }
};

// ✅ Lấy danh sách bàn
const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().populate("area").populate("currentOrder");
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

const getTablesByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const tables = await Table.find({ status: status }).populate("area");
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables", error });
  }
};


const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ data: table });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table', error });
  }
};

// ✅ Sửa bàn
const updateTable = async (req, res, next) => {
  try {
    const { tableNo, seats, area, status, currentOrder, reservations, currentTurn, menuType } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "ID không hợp lệ"));
    }

    const table = await Table.findById(id);
    if (!table) {
      return next(createHttpError(404, "Không tìm thấy bàn"));
    }

    if (area && area !== String(table.area)) {
      await Area.findByIdAndUpdate(table.area, { $pull: { tables: table._id } });
      await Area.findByIdAndUpdate(area, { $addToSet: { tables: table._id } });
    }

    const updated = await Table.findByIdAndUpdate(id, { tableNo, seats, area, status, currentOrder, reservations, currentTurn, menuType }, { new: true });

    res.json({ success: true, message: "Cập nhật bàn thành công!", data: updated });
  } catch (error) {
    next(error);
  }
};

// ✅ Xoá bàn
const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await Table.findByIdAndDelete(id);
    if (!table) {
      return next(createHttpError(404, "Không tìm thấy bàn"));
    }

    if (table.area) {
      await Area.findByIdAndUpdate(table.area, { $pull: { tables: table._id } });
    }

    res.json({ success: true, message: "Đã xoá bàn!", data: table });
  } catch (error) {
    next(error);
  }
};

// ✅ Chuyển bàn
const switchTable = async (req, res, next) => {
  try {
    const { fromTableId, toTableId } = req.body;

    const fromTable = await Table.findById(fromTableId);
    const toTable = await Table.findById(toTableId);

    if (!fromTable || !toTable) {
      return next(createHttpError(404, "Không tìm thấy bàn cần chuyển"));
    }

    if (toTable.status !== "Available") {
      return next(createHttpError(400, "Bàn đích không trống"));
    }

    // Nếu bàn nguồn không có đơn hàng hiện tại thì không cần chuyển
    if (!fromTable.currentOrder) {
      return next(createHttpError(400, "Bàn nguồn không có đơn hàng để chuyển"));
    }

    // Cập nhật order sang bàn mới
    const order = await Order.findById(fromTable.currentOrder);
    if (!order) {
      return next(createHttpError(404, "Không tìm thấy đơn hàng của bàn nguồn"));
    }

    order.table = toTableId;
    await order.save();

    // Cập nhật trạng thái bàn đích
    toTable.currentOrder = fromTable.currentOrder;
    toTable.status = "Occupied";
    await toTable.save();

    // Cập nhật bàn nguồn thành trống
    fromTable.currentOrder = null;
    fromTable.status = "Available";
    await fromTable.save();

    res.json({ success: true, message: "Đã chuyển bàn thành công!" });
  } catch (error) {
    next(error);
  }
};


// ✅ Gộp bàn
const mergeTables = async (req, res, next) => {
  try {
    const { tableIds, targetTableId } = req.body;

    if (!Array.isArray(tableIds) || tableIds.length < 2) {
      return next(createHttpError(400, "Cần chọn ít nhất 2 bàn để gộp"));
    }

    if (!targetTableId || !tableIds.includes(targetTableId)) {
      return next(createHttpError(400, "Bàn đích không hợp lệ"));
    }

    // Lấy tất cả các order của các bàn
    const tables = await Table.find({ _id: { $in: tableIds } }).populate("currentOrder");

    const targetTable = tables.find((t) => t._id.toString() === targetTableId);
    if (!targetTable || !targetTable.currentOrder) {
      return next(createHttpError(404, "Không tìm thấy hoá đơn của bàn đích"));
    }

    const targetOrder = targetTable.currentOrder;

    // Duyệt các bàn còn lại (không phải bàn đích)
    for (const table of tables) {
      if (table._id.toString() === String(targetTableId)) continue;

      const sourceOrder = table.currentOrder;
      if (sourceOrder) {
        for (const item of sourceOrder.items) {
          const index = targetOrder.items.findIndex(
            (i) => i.name === item.name
          );

          if (index !== -1) {
            // Nếu đã tồn tại thì cộng dồn số lượng
            const existingItem = targetOrder.items[index];
            const mergedQuantity = existingItem.quantity + item.quantity;
            const mergedPrice = mergedQuantity * existingItem.pricePerQuantity;

            // Xoá item cũ
            targetOrder.items.splice(index, 1);

            // Thêm item mới đã cộng dồn
            targetOrder.items.push({
              name: item.name,
              quantity: mergedQuantity,
              pricePerQuantity: existingItem.pricePerQuantity,
              price: mergedPrice,
            });
          } else {
            // Nếu chưa tồn tại, thêm mới
            targetOrder.items.push({
              name: item.name,
              quantity: item.quantity,
              pricePerQuantity: item.pricePerQuantity,
              price: item.quantity * item.pricePerQuantity,
            });
          }
        }

        // Cộng dồn tiền
        targetOrder.bills.total += sourceOrder.bills.total;
        targetOrder.bills.tax += sourceOrder.bills.tax;
        targetOrder.bills.totalWithTax += sourceOrder.bills.totalWithTax;

        // Xoá order nguồn
        await Order.findByIdAndDelete(sourceOrder._id);
      }
    }

    await targetOrder.save();

    // Cập nhật trạng thái bàn
    for (const table of tables) {
      if (table._id.toString() === targetTableId) {
        table.currentOrder = targetOrder._id;
        table.status = "Occupied";
      } else {
        table.currentOrder = null;
        table.status = "Available";
      }
      await table.save();
    }

    res.json({ success: true, message: "Đã gộp bàn thành công", mergedOrder: targetOrder });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  addTable,
  getTables,
  getTableById,
  getTablesByStatus,
  updateTable,
  deleteTable,
  switchTable,
  mergeTables,
};
