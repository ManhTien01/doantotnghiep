import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import api from "../../https"; // đảm bảo đường dẫn đúng đến file chứa getCategories

export default function TableInfoModal({
  open,
  onClose,
  onConfirm,
  adults,
  setAdults,
  children,
  setChildren,
  menuType,
  setMenuType,
}) {
  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (menuType === "buffet" || menuType === "combo") {
        try {
          const res = await api.getCategories({
            type: "menu",
            menuType: menuType,
            limit: 100, // để lấy hết
          });
          setMenuOptions(res.categories);
        } catch (error) {
          enqueueSnackbar("Lỗi khi tải danh mục menu", { variant: "error" });
        }
      } else {
        setMenuOptions([]);
      }
    };

    fetchCategories();
  }, [menuType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Thông tin bàn</h2>

        <label className="block mb-2 font-medium">Số lượng người lớn</label>
        <input
          type="number"
          min={1}
          value={adults}
          onChange={(e) =>
            setAdults(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block mb-2 font-medium">Số lượng trẻ em</label>
        <input
          type="number"
          min={0}
          value={children}
          onChange={(e) =>
            setChildren(Math.max(0, parseInt(e.target.value) || 0))
          }
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <fieldset className="mb-4">
          <legend className="font-medium mb-2">Chọn loại menu</legend>
          <div className="flex gap-4 flex-wrap">
            {["alacart", "buffet", "combo"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="menuType"
                  value={type}
                  checked={menuType === type}
                  onChange={() => setMenuType(type)}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        {(menuType === "buffet" || menuType === "combo") && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Danh mục {menuType === "buffet" ? "Buffet" : "Combo"}
            </label>
            {menuOptions.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-700">
                {menuOptions.map((item) => (
                  <li
                    key={item._id}
                    className="border px-3 py-1 rounded bg-gray-50"
                  >
                    {item.name} - {item.price?.toLocaleString()}₫
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Không có danh mục phù hợp.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              if (adults < 1) {
                enqueueSnackbar("Số lượng người lớn phải lớn hơn 0", {
                  variant: "warning",
                });
                return;
              }
              onConfirm({ adults, children, menuType });
            }}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
