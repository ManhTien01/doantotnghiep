import React from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import api from "../../https/index";

const RecentOrders = () => {
  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.getOrders(), // dùng trực tiếp hàm getOrders trong api
    keepPreviousData: true, // giữ dữ liệu cũ khi refetch
  });

  if (isError) {
    enqueueSnackbar("Đã xảy ra lỗi!", { variant: "error" });
  }

  return (
    <div className="grow h-full mt-4">
      <div className="bg-[#1a1a1a] w-full rounded-lg max-h-[500px] sm:h-[450px] flex flex-col">

        {/* Tiêu đề */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wide">
            Đơn hàng gần đây
          </h1>
          <a href="#" className="text-[#025cca] text-sm font-semibold">
            Xem tất cả
          </a>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center gap-3 bg-[#1f1f1f] rounded-[15px] px-4 sm:px-6 py-3 mx-4 sm:mx-6">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Tìm đơn hàng gần đây"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] flex-1 text-sm"
          />
        </div>

        {/* Danh sách đơn hàng */}
        <div className="mt-4 px-4 sm:px-6 pb-[64px] overflow-y-auto no-scrollbar flex-1">
          {resData?.data.length > 0 ? (
            resData.data.map((order) => (
              <OrderList key={order._id} order={order} />
            ))
          ) : (
            <p className="text-gray-500">Không có đơn hàng nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
