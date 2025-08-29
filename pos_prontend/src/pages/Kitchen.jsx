import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../https";

const Kitchen = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // mặc định hôm nay
  const queryClient = useQueryClient();

  // Lấy đơn theo ngày
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["kitchenOrders", selectedDate],
    queryFn: () => api.getOrders({ date: selectedDate }),
    staleTime: 10000,
    refetchInterval: 5000,
  });

  // Thêm 'turn' vào mutationFn và payload
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, dishId, status, turn }) =>
      api.updateDishStatus({ orderId, dishId, status, turn }),
    onSuccess: () => {
      queryClient.invalidateQueries(["kitchenOrders", selectedDate]);
    },
  });

  const orders = response?.data || [];

  // Tạo mảng phẳng món ăn kèm info order
  const flattenedItems = React.useMemo(() => {
    if (!orders) return [];
    return orders.flatMap((order) =>
      order.items?.flatMap((turnObj) =>
        turnObj.items.map((item) => ({
          ...item,
          orderId: order._id,
          dishId: item.dish?._id,
          dishName: item.dish?.name,
          tableNo: order.table?.tableNo || order.tableNo || "Chưa xác định",
          turn: turnObj.turn,
          time: turnObj.time,
        }))
      )
    );
  }, [orders]);

  // Lọc theo trạng thái
  const filteredItems = React.useMemo(() => {
    return flattenedItems.filter((item) => {
      return filter === "Tất cả" || item.status === filter;
    });
  }, [flattenedItems, filter]);

  // Sắp xếp món ăn theo trạng thái và thời gian giảm dần
  const sortedItems = React.useMemo(() => {
    const statusPriority = {
      "Đang chế biến": 1,
      "Đã phục vụ": 3,
    };

    return [...filteredItems].sort((a, b) => {
      const aPriority = statusPriority[a.status] || 2;
      const bPriority = statusPriority[b.status] || 2;

      if (filter === "Tất cả") {
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
      }

      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();

      return timeB - timeA;
    });
  }, [filteredItems, filter]);

  // Sửa: thêm turn khi gọi mutate
  const toggleStatus = (item) => {
    if (updateStatusMutation.isLoading) return;
    if (item.status === "Đã phục vụ") return;

    const newStatus = "Đã phục vụ";

    updateStatusMutation.mutate({
      orderId: item.orderId,
      dishId: item.dishId,
      status: newStatus,
      turn: item.turn, // truyền turn vào đây
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading)
    return <p className="text-center mt-20 text-xl">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-xl text-red-600">
        Lỗi tải dữ liệu bếp!
      </p>
    );

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 uppercase">
        Màn hình bếp
      </h1>

      {/* Chọn ngày */}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          max={new Date().toISOString().slice(0, 10)}
        />
      </div>

      {/* Filter trạng thái */}
      <div className="flex justify-center mb-6 space-x-2">
        {["Tất cả", "Đang chế biến", "Đã phục vụ"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded text-lg font-semibold border ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border-gray-400 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Nút in phiếu */}
      <div className="text-center mb-6">
        <button
          onClick={handlePrint}
          className="px-8 py-3 bg-green-600 text-white text-xl rounded hover:bg-green-700"
          disabled={flattenedItems.length === 0}
        >
          In phiếu bếp ({selectedDate})
        </button>
      </div>

      {/* Danh sách món ăn */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedItems.map((item, index) => {
            const isDone = item.status === "Đã phục vụ";
            const isCooking = item.status === "Đang chế biến";

            return (
              <div
                key={`${item.orderId}-${index}`}
                className={`rounded-xl p-4 shadow-md border cursor-pointer transition duration-200 select-none ${
                  isCooking
                    ? "border-red-500"
                    : isDone
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                onClick={() => toggleStatus(item)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">{item.dishName}</h3>
                  <span className="text-sm font-semibold">
                    Bàn {item.tableNo}
                  </span>
                </div>
                <p className="mb-1">Số lượng: {item.quantity}</p>
                {item.notes && (
                  <p className="mb-1 text-yellow-600 italic">Ghi chú: {item.notes}</p>
                )}
                <p
                  className={`text-sm font-semibold ${
                    isCooking
                      ? "text-red-600"
                      : isDone
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  Trạng thái: {item.status}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(item);
                  }}
                  disabled={updateStatusMutation.isLoading || isDone}
                  className={`mt-2 px-4 py-2 rounded font-semibold text-white transition-colors duration-200 ${
                    isCooking
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isCooking ? "Đánh dấu đã phục vụ" : "Đã phục vụ"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-2xl text-gray-500 col-span-full text-center mt-20">
          Không có món nào trong ngày này
        </p>
      )}
    </div>
  );
};

export default Kitchen;
