// src/components/kitchen/DishItem.jsx
import React from "react";

const DishItem = ({ item, index }) => {
    const { dish, quantity, notes, status } = item;

    const statusColor = {
        "Đang chế biến": "bg-yellow-100 text-yellow-800",
        "Đã phục vụ": "bg-green-100 text-green-800",
    };

    return (
        <div className="border rounded-xl p-4 mb-3 shadow-md bg-white">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                    {index + 1}. {dish.name}
                </h2>
                <span
                    className={`text-sm px-2 py-1 rounded ${statusColor[status] || "bg-gray-100 text-gray-800"}`}
                >
                    {status}
                </span>
            </div>
            <div className="text-xl text-gray-600 mb-1">
                Số lượng: <span className="font-semibold text-black">{quantity}</span>
            </div>
            {notes && (
                <div className="text-lg text-gray-500 italic">
                    Ghi chú: {notes}
                </div>
            )}
        </div>
    );
};

export default DishItem;
