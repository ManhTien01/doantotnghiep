import React from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const OrderList = ({ order }) => {
  if (!order) return null;

  return (
    <div className="w-full">
      {/* Hiển thị đơn giản trên điện thoại */}
      <div className="flex items-center justify-between bg-[#1f1f1f] rounded-lg px-4 py-3 mb-3 md:hidden">
        {/* Thông tin bàn */}
        <div className="text-sm text-[#f6b100] font-semibold border border-[#f6b100] rounded-lg px-2 py-1">
          Bàn{" "}
          <FaLongArrowAltRight className="inline mx-1 text-[#ababab]" />{" "}
          {order.table?.tableNo || "Không rõ"}
        </div>

        {/* Trạng thái đơn */}
        {order.orderStatus === "Paid" ? (
          <div className="text-green-500 bg-[#2e4a40] px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <FaCheckDouble /> Đã thanh toán
          </div>
        ) : (
          <div className="text-yellow-500 bg-[#4a452e] px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <FaCircle /> {order.orderStatus === "Pending" ? "Chờ xử lý" : order.orderStatus}
          </div>
        )}
      </div>

      {/* Hiển thị đầy đủ trên màn hình lớn */}
      <div className="hidden md:grid grid-cols-[50px_1fr_150px_180px] items-center gap-4 mb-3 bg-[#1f1f1f] px-4 py-3 rounded-lg">
        {/* Avatar */}
        <button className="bg-[#f6b100] w-12 h-12 text-xl font-bold rounded-lg flex items-center justify-center">
          {getAvatarName(order.customerDetails?.name || "")}
        </button>

        {/* Thông tin khách hàng */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            {order.customerDetails?.name || "Không rõ tên"}
          </h1>
          <p className="text-[#ababab] text-sm">{order.items?.length || 0} món</p>
        </div>

        {/* Thông tin bàn */}
        <div className="text-[#f6b100] font-semibold border border-[#f6b100] rounded-lg px-2 py-1 text-center">
          Bàn <FaLongArrowAltRight className="inline mx-1 text-[#ababab]" />{" "}
          {order.table?.tableNo || "Không rõ"}
        </div>

        {/* Trạng thái đơn */}
        <div className="text-sm">
          {order.orderStatus === "Paid" ? (
            <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg flex items-center justify-center">
              <FaCheckDouble className="inline mr-2" /> Đã thanh toán
            </p>
          ) : (
            <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg flex items-center justify-center">
              <FaCircle className="inline mr-2" />{" "}
              {order.orderStatus === "Unpaid" ? "Chưa thanh toán" : order.orderStatus}
            </p>
          )}
        </div>
      </div>


    </div>
  );
};

export default OrderList;
