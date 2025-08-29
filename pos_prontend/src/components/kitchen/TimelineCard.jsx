import React from "react";
import DishItem from "./DishItem";
import KitchenPrint from "./KitchenPrint";

const TimelineCard = ({ turnObj }) => {
  const { turn, time, items } = turnObj;
  const date = new Date(time).toLocaleTimeString("vi-VN");

  const handlePrint = () => {
    const content = document.getElementById(`print-${turn}`);
    const win = window.open("", "", "width=600,height=800");
    win.document.write(`<html><head><title>Phiếu bếp</title></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-gray-50 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-red-600">🧾 Lượt {turn + 1} – {date}</h2>
        <button onClick={handlePrint} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
          🖨 In phiếu bếp
        </button>
      </div>

      <div id={`print-${turn}`}>
        <KitchenPrint items={items} turn={turn} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {items.map((item, index) => (
          <DishItem key={index} item={item} turn={turn} />
        ))}
      </div>
    </div>
  );
};

export default TimelineCard;
