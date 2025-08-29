import { FaNotesMedical } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri"

const CartList = ({
    cartItems,
    editingNote,
    tempNote,
    setTempNote,
    handleNoteActions,
    handleRemove,
    isMerge,
    scrollRef
}) => {
    if (!cartItems.length || !cartItems[0]?.items?.length) {
        return (
            <p className="text-center text-gray-400 italic h-[338px] flex items-center justify-center">
                Giỏ hàng đang trống. Vui lòng chọn món!
            </p>
        );
    }

    return (
        <div  ref={scrollRef} className="overflow-y-scroll no-scrollbar h-[338px] space-y-3">
        {cartItems
          .filter((turn) => Array.isArray(turn.items) && turn.items.length > 0) // Lọc lượt có món
          .map((turn, turnIdx) => (
            <div key={`turn-${turnIdx}`} className="mb-6">
              {!isMerge && (
                <div className="text-sm text-gray-300 mb-2 italic">
                  <span className="font-semibold text-white">Lượt gọi {turnIdx + 1}</span> - Gọi lúc:{" "}
                  {new Date(turn.time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
      
              {turn.items.map((item, itemIdx) => (
                <div
                  key={`${itemIdx}-${item.dish?._id}`}
                  className="bg-zinc-800 rounded-xl p-4 shadow-md hover:bg-zinc-700 mb-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-white truncate max-w-[150px]">
                      {item?.dish?.name}
                    </div>
                    <div className="flex items-center gap-4 text-yellow-400 font-semibold min-w-[250px] justify-end">
                      <span>x{item.quantity}</span>
                      <span>{item?.dish?.price?.toLocaleString("vi-VN")}đ</span>
      
                      {editingNote.id === item?.dish?._id && editingNote.turn === turnIdx ? (
                        <>
                          <input
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            onKeyDown={(e) => handleNoteActions.keyDown(e, item.dish._id, turnIdx)}
                            className="px-2 py-1 rounded bg-zinc-700 text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleNoteActions.save(item.dish._id, turnIdx)}
                            className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => handleNoteActions.cancel()}
                            className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNoteActions.start(item?.dish?._id, turnIdx, item.notes)}
                          className="p-1 rounded text-white hover:bg-zinc-700"
                        >
                          <FaNotesMedical />
                        </button>
                      )}
      
                      <button
                        onClick={() => handleRemove(item.dish._id, turnIdx)}
                        className="text-white hover:text-red-600"
                      >
                        <RiDeleteBin2Fill />
                      </button>
                    </div>
                  </div>
      
                  {item.notes && (
                    <div className="mt-2 text-xs text-gray-400 italic max-w-[250px] truncate">
                      Ghi chú: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>
      
    );
};

export default CartList;
