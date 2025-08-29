import React from "react";
import { getValidReservations, deriveTableStatus } from "../../utils/tableLogicUtils";

const borderColorByStatus = {
  Available: "#22c55e", // xanh lá
  Occupied: "#ef4444",  // đỏ
  Reserved: "#eab308",  // vàng
};

const TableCard = ({
  id,
  name,
  status,
  seats,
  reservations = [],
  isEditMode = false,
  onEdit,
  onDelete,
  isSelectable = false,
  isSelected = false,
  onSelect,
  onClick
}) => {
  const handleEditClick = () => {
    const newSeats = prompt("Nhập số chỗ ngồi mới:", seats);
    const seatsNum = Number(newSeats);
    if (!isNaN(seatsNum) && seatsNum > 0) {
      onEdit && onEdit(id, seatsNum);
    } else {
      alert("Vui lòng nhập số hợp lệ (>0).");
    }
  };

  const handleClick = () => {
    if (isSelectable) {
      onSelect && onSelect(id);
    } else {
      onClick && onClick();
    }
  };

  // ✅ Lấy reservation tương lai gần nhất
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const parsedReservations = reservations
    .map((res) => {
      const datePart = res.date.split("T")[0];
      const dateTime = new Date(`${datePart}T${res.time}:00+07:00`);
      return { ...res, dateTime };
    })
    .filter(res => {
      const keepUntil = new Date(res.dateTime.getTime() + 30 * 60 * 1000);
      const isSameDay = res.dateTime.toISOString().split("T")[0] === todayStr;
      return keepUntil > now && isSameDay;
    })
    .sort((a, b) => a.dateTime - b.dateTime);


  const closestFutureReservation = parsedReservations[0];

  let formattedReservationTime = null;
  if (closestFutureReservation) {
    formattedReservationTime = closestFutureReservation.dateTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ✅ Nếu còn reservation trong tương lai thì xem là Reserved
  const derivedStatus = parsedReservations.length > 0 ? "Reserved" : status;

  const borderColor = isSelectable && isSelected
    ? "#3b82f6"
    : (borderColorByStatus[derivedStatus] || "transparent");

  let isLateButHolding = false;
  if (closestFutureReservation) {
    const start = closestFutureReservation.dateTime;
    const endHold = new Date(start.getTime() + 30 * 60 * 1000);
    isLateButHolding = now > start && now <= endHold;
  }

  return (
    <div
      className="relative p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center text-white transition duration-200"
      style={{
        border: `3px solid ${borderColor}`,
        backgroundColor: "#262626",
        minHeight: "150px",
        maxHeight: "200px",
      }}
      onClick={handleClick}
    >
      {/* Tên bàn */}
      <h2 className="text-2xl font-semibold">{name}</h2>

      {/* Số chỗ ngồi */}
      <p className="text-sm mt-2">
        Chỗ ngồi: <span className="font-medium">{seats}</span>
      </p>

      {/* Thời gian đặt gần nhất trong tương lai */}
      {formattedReservationTime && (
        <p className={`text-sm mt-1 ${isLateButHolding ? "text-red-400" : "text-blue-300"}`}>
          Đặt lúc: {formattedReservationTime}
        </p>
      )}

      {/* Nút sửa/xoá khi ở chế độ chỉnh sửa */}
      {isEditMode && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(id);
            }}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Xoá
          </button>
        </div>
      )}
    </div>
  );
};

export default TableCard;
