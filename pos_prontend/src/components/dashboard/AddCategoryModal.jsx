import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import api from "../../https";
import { enqueueSnackbar } from "notistack";

const AddCategoryModal = ({ setIsAddCategoryModalOpen }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    isMenu: false,
    menuType: "",
    price: "", // ➕ thêm trường price
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setCategoryData((prev) => {
      // Nếu bỏ chọn isMenu thì reset menuType và price
      if (name === "isMenu" && !checked) {
        return { ...prev, isMenu: false, menuType: "", price: "" };
      }

      // Nếu chọn lại menuType không phải buffet hoặc alacart thì reset price
      if (name === "menuType" && !(value === "buffet" || value === "alacart")) {
        return { ...prev, menuType: value, price: "" };
      }

      return { ...prev, [name]: val };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      categoryData.isMenu &&
      (categoryData.menuType === "buffet" || categoryData.menuType === "combo") &&
      (!categoryData.price || isNaN(categoryData.price) || categoryData.price < 0)
    ) {
      enqueueSnackbar("Giá không hợp lệ!", { variant: "warning" });
      return;
    }

    categoryMutation.mutate({
      ...categoryData,
      price: categoryData.price ? parseFloat(categoryData.price) : undefined,
    });
  };

  const handleCloseModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const categoryMutation = useMutation({
    mutationFn: (reqData) => api.addCategory(reqData),
    onSuccess: () => {
      setIsAddCategoryModalOpen(false);
      enqueueSnackbar("Thêm danh mục thành công!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar("Thêm danh mục thất bại!", { variant: "error" });
      console.error(error);
    },
  });

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
          <h2 className="text-xl font-semibold text-gray-800">Thêm danh mục</h2>
          <button onClick={handleCloseModal} className="text-gray-700 hover:text-red-500">
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Tên danh mục</label>
            <input
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
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
              checked={categoryData.isMenu}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-blue-600"
              id="isMenu"
            />
            <label htmlFor="isMenu" className="text-gray-700">
              Đây là nhóm trong thực đơn (Menu)
            </label>
          </div>

          {categoryData.isMenu && (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Loại thực đơn</label>
                <select
                  name="menuType"
                  value={categoryData.menuType}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                >
                  <option value="">-- Chọn loại menu --</option>
                  <option value="alacart">Alacart</option>
                  <option value="buffet">Buffet</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              {(categoryData.menuType === "buffet" || categoryData.menuType === "combo") && (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Giá</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={categoryData.price}
                    onChange={handleInputChange}
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
              onClick={handleCloseModal}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={
                categoryData.isMenu && !categoryData.menuType
              }
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Thêm danh mục
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCategoryModal;
