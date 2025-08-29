// controllers/metricsController.js
const Order = require("../models/orderModel");
const moment = require("moment");

const getMonthlyMetrics = async (req, res) => {
  try {
    const { month } = req.query; // ví dụ: "2025-06"
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Tháng không hợp lệ. Định dạng: YYYY-MM" });
    }

    const startDate = moment(month + "-01").startOf("month").toDate();
    const endDate = moment(startDate).endOf("month").toDate();

    // Tìm các đơn hàng trong tháng đó
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      orderStatus: "Paid" // chỉ tính các đơn đã hoàn thành (nếu cần)
    });

    let totalRevenue = 0;
    let totalCustomers = 0;
    const dailyMap = {};

    orders.forEach((order) => {
      const day = moment(order.createdAt).format("YYYY-MM-DD");
      const revenue = order.bills?.totalWithTax || 0;
      const guests = order.customerDetails?.guests || 0;

      totalRevenue += revenue;
      totalCustomers += guests;

      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, revenue: 0, customers: 0 };
      }

      dailyMap[day].revenue += revenue;
      dailyMap[day].customers += guests;
    });

    // Chuyển thành mảng & sắp xếp theo ngày
    const daily = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalRevenue,
      totalCustomers,
      daily
    });
  } catch (err) {
    console.error("Lỗi khi lấy metrics:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = { getMonthlyMetrics };
