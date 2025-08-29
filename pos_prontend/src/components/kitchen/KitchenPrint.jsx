import React from "react";

const KitchenPrint = ({ items, turn }) => {
  return (
    <div className="text-lg">
      <h2 className="font-bold text-center text-xl mb-2">🧾 PHIẾU BẾP – Lượt {turn + 1}</h2>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx}>
            🍽 {item.dish.name} × {item.quantity}
            {item.notes && <div className="italic text-sm">📝 {item.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitchenPrint;
