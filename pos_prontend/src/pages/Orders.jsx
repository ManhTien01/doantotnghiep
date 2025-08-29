import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { useQuery } from "@tanstack/react-query";
import api from "../https/index";
import { enqueueSnackbar } from "notistack";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = "Asia/Ho_Chi_Minh";

const isSameDayVN = (date1, date2) => {
  return dayjs(date1).tz(VN_TZ).format("YYYY-MM-DD") === dayjs(date2).tz(VN_TZ).format("YYYY-MM-DD");
};

const Orders = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Đơn hàng";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.getOrders(),
  });

  if (isError) {
    enqueueSnackbar("Đã xảy ra lỗi khi tải đơn hàng!", { variant: "error" });
  }

  // Lấy ngày hiện tại theo VN timezone
  const todayVN = dayjs().tz(VN_TZ);

  // Lọc đơn hàng theo trạng thái và ngày cùng trong ngày hiện tại (VN time)
  const filteredOrders = (resData?.data || []).filter((order) => {
    const statusMatch = status === "all" ? true : order.orderStatus === status;
    const dateMatch = isSameDayVN(order.orderDate, todayVN);
    return statusMatch && dateMatch;
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
      {/* Tiêu đề */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-10 py-4 gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Đơn hàng</h1>
        </div>

        {/* Nút lọc theo trạng thái */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "Unpaid", "Paid"].map((type) => (
            <button
              key={type}
              onClick={() => setStatus(type)}
              className={`text-[#ababab] text-sm md:text-lg font-semibold px-4 py-2 rounded-lg ${
                status === type ? "bg-[#383838]" : ""
              }`}
            >
              {type === "all"
                ? "Tất cả"
                : type === "Unpaid"
                ? "Chưa thanh toán"
                : "Đã thanh toán"}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="flex-1 overflow-y-auto px-4 md:px-16 pb-[64px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">Hiện chưa có đơn hàng nào</p>
          )}
        </div>
      </div>

      {/* Thanh điều hướng dưới */}
      <BottomNav />
    </section>
  );
};

export default Orders;
