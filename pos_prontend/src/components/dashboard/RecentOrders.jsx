import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import api from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.getOrders(),
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <p className="text-center text-gray-600 mt-10">
        Đang tải danh sách đơn hàng...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-600 mt-10">
        Lỗi khi tải danh sách đơn hàng!
      </p>
    );
  }

  return (
    <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Đơn hàng gần đây</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-700 text-sm">
          <thead className="bg-gray-100 uppercase text-gray-600 text-xs">
            <tr>
              <th className="px-4 py-3">Mã đơn hàng</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Trạng thái đơn</th>
              <th className="px-4 py-3">Ngày giờ</th>
              <th className="px-4 py-3">Số món</th>
              <th className="px-4 py-3">Số bàn</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Phương thức thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {resData?.data.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-mono text-gray-900">
                  #{order._id.slice(-5).toUpperCase()}
                </td>
                <td className="px-4 py-3">{order.customerDetails.name}</td>
                <td className="px-4 py-3">
                  <select
                    disabled
                    className={`bg-gray-100 text-gray-700 border border-gray-300 p-2 rounded-lg cursor-not-allowed ${order.orderStatus === "Paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                      }`}
                    value={order.orderStatus}
                  >
                    <option value="Unpaid">Đang xử lý</option>
                    <option value="Paid">Hoàn thành</option>
                  </select>
                </td>
                <td className="px-4 py-3">{formatDateAndTime(order.orderDate)}</td>
                <td className="px-4 py-3">{order.items.length} món</td>
                <td className="px-4 py-3">Bàn {order.table?.tableNo || "Chưa xác định"}</td>
                <td className="px-4 py-3">₫{order.bills.totalWithTax.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">{order.paymentMethod || "Chưa thanh toán"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
