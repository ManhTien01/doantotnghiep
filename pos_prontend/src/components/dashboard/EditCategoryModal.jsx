import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { enqueueSnackbar } from "notistack";

const EditCategoryModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    isMenu: false,
    menuType: "",
    price: "",
  });

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        name: data.name || "",
        isMenu: typeof data.isMenu === "boolean" ? data.isMenu : false,
        menuType: data.menuType || "",
        price: data.price !== undefined ? data.price : "",
      });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    }
  }, [data, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      if (name === "isMenu" && !checked) {
        return { ...prev, isMenu: false, menuType: "", price: "" };
      }
      if (name === "menuType" && !(value === "buffet" || value === "combo")) {
        return { ...prev, menuType: value, price: "" };
      }
      return { ...prev, [name]: val };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      enqueueSnackbar("Tên danh mục không được để trống!", { variant: "warning" });
      return;
    }

    if (formData.isMenu && !formData.menuType) {
      enqueueSnackbar("Vui lòng chọn loại thực đơn!", { variant: "warning" });
      return;
    }

    if (
      formData.isMenu &&
      (formData.menuType === "buffet" || formData.menuType === "combo") &&
      (!formData.price || isNaN(formData.price) || formData.price < 0)
    ) {
      enqueueSnackbar("Giá không hợp lệ!", { variant: "warning" });
      return;
    }

    onSave({
      ...data,
      name: formData.name.trim(),
      isMenu: Boolean(formData.isMenu),
      menuType: formData.isMenu ? formData.menuType : "",
      price:
        formData.isMenu && (formData.menuType === "buffet" || formData.menuType === "combo")
          ? parseFloat(formData.price)
          : undefined,
    });
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa danh mục</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-red-500">
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Tên danh mục</label>
            <input
              ref={nameInputRef}
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên danh mục"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isMenu"
              checked={formData.isMenu}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600"
              id="isMenu"
            />
            <label htmlFor="isMenu" className="text-gray-700">
              Đây là nhóm trong thực đơn (Menu)
            </label>
          </div>

          {formData.isMenu && (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Loại thực đơn</label>
                <select
                  name="menuType"
                  value={formData.menuType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                >
                  <option value="">-- Chọn loại menu --</option>
                  <option value="alacart">Alacart</option>
                  <option value="buffet">Buffet</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              {(formData.menuType === "buffet" || formData.menuType === "combo") && (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Giá</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                    placeholder="Nhập giá (VNĐ)"
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={formData.isMenu && !formData.menuType}
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCategoryModal;
