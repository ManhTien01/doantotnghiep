import React from "react";

const Modal = ({
  isOpen,
  onClose,
  cartItems = [], // [{ turn, time, items: [...] }, ...]
  showServed,
  showUnserved,
  toggleShowServed,
  toggleShowUnserved,
  handleToggleServedInModal,
  handleToggleAllInTurn,
  handleToggleAll,
}) => {
  if (!isOpen) return null;

  // Lọc món theo trạng thái "Đã phục vụ"/khác
  const filteredTurns = cartItems.map((turnObj) => {
    const filteredItems = Array.isArray(turnObj.items)
      ? turnObj.items.filter(
          (item) =>
            (showServed && item.status === "Đã phục vụ") ||
            (showUnserved && item.status !== "Đã phục vụ")
        )
      : [];

    return { turn: turnObj.turn, items: filteredItems };
  });

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-lg max-w-md w-full h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Danh sách món</h2>
          <div className="flex gap-2">
            <button
              onClick={toggleShowUnserved}
              className={`p-2 rounded-full ${
                showUnserved ? "bg-green-500 text-black" : "bg-zinc-800 text-white"
              }`}
              title="Hiện món chưa phục vụ"
            >
              U
            </button>
            <button
              onClick={toggleShowServed}
              className={`p-2 rounded-full ${
                showServed ? "bg-blue-500 text-black" : "bg-zinc-800 text-white"
              }`}
              title="Hiện món đã phục vụ"
            >
              S
            </button>
            <button
              onClick={handleToggleAll}
              className="p-2 rounded-full bg-yellow-500 text-black font-medium"
              title="Tích tất cả món"
            >
              T
            </button>
          </div>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
          {filteredTurns.map(({ turn, items }) => {
            if (items.length === 0) return null;

            const isAllChecked = items.every(
              (item) => item.status === "Đã phục vụ"
            );

            return (
              <div key={turn} className="mb-6">
                <div className="flex justify-between items-center mb-2 text-white font-semibold">
                  <span>Lượt order {turn + 1}</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={() => {
                        if (!isAllChecked) {
                          handleToggleAllInTurn(turn);
                        }
                      }}
                      className="mr-8"
                    />
                  </label>
                </div>

                <table className="w-full text-white border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 w-[50%]">Tên món</th>
                      <th className="text-left py-2 w-[30%]">Trạng thái</th>
                      <th className="text-center py-2 w-[20%]">Phục vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={`${item.dish._id}-${turn}`}
                        className="border-b border-gray-700 hover:bg-zinc-800"
                      >
                        <td className="py-2 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                          {item.dish.name}
                        </td>
                        <td className="py-2 max-w-[120px] truncate overflow-hidden whitespace-nowrap">
                          {item.status}
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={item.status === "Đã phục vụ"}
                            onChange={() =>
                              handleToggleServedInModal(item.dish._id, turn)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Nút đóng */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
