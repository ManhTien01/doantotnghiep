import React from "react";
import {
  FaCheckDouble,
  FaLongArrowAltRight,
  FaCircle,
} from "react-icons/fa";
import {
  formatDateAndTime,
  getAvatarName,
} from "../../utils/index";

const OrderCard = ({ order }) => {
  if (!order) return null;

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="bg-[#262626] p-3 md:p-4 rounded-xl shadow-md mb-4 hover:shadow-lg hover:scale-[1.01] transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button className="bg-[#f6b100] w-10 h-10 md:w-12 md:h-12 text-sm md:text-lg font-bold rounded-full flex items-center justify-center text-white shadow-md">
          {getAvatarName(order.customerDetails.name)}
        </button>

        <div className="flex flex-1 justify-between items-center w-full sm:w-auto">
          <h1 className="text-white text-sm md:text-base font-semibold">
            {order.customerDetails.name}
          </h1>
          {order.orderStatus === "Paid" ? (
            <p className="text-green-500 bg-green-900/30 px-2 py-1 rounded-lg text-xs md:text-sm font-medium flex items-center">
              <FaCheckDouble className="mr-1" /> Đã thanh toán
            </p>
          ) : (
            <p className="text-yellow-500 bg-yellow-900/30 px-2 py-1 rounded-lg text-xs md:text-sm font-medium flex items-center">
              <FaCircle className="mr-1" /> Chưa thanh toán
            </p>
          )}
        </div>
      </div>

      {/* Thông tin khác */}
      <div className="mt-2 text-xs md:text-sm text-gray-400 space-y-1">
        <p>{order.customerDetails.guests} khách / Ăn tại bàn</p>
        <p className="flex items-center gap-1">
          Bàn <FaLongArrowAltRight /> {order.table?.tableNo || "Không xác định"}
        </p>
      </div>

      {/* Thời gian & số món */}
      <div className="flex justify-between items-center mt-3 text-xs md:text-sm text-gray-400">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} món</p>
      </div>

      <hr className="w-full my-3 border-t border-gray-600" />

      {/* Tổng tiền */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-sm md:text-base font-semibold">Tổng tiền</h1>
        <p className="text-white text-sm md:text-base font-semibold">
          {formatCurrency(order.bills.totalWithTax)}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
