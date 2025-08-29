import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../https";
import { enqueueSnackbar } from "notistack";

const AddDishesModal = ({ setIsAddDishesModalOpen }) => {
  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    category: "",
    status: "available",
    description: "",
    image: "",
    tax: 0,
    type: "",
  });

  const [fileImage, setFileImage] = useState(null);
  const [ingredients, setIngredients] = useState([{ ingredient: "", amount: 1 }]);
  const [menuType, setMenuType] = useState(""); // Lưu lại loại menu tương ứng với category đã chọn

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories({ search: "", page: 1, limit: 100 }),
  });

  const { data: ingredientData } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => api.getIngredients({ search: "", page: 1, limit: 100 }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFileImage(e.target.files[0]);
  };

  const handleCloseModal = () => {
    setIsAddDishesModalOpen(false);
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: field === "amount" ? Number(value) : value } : item
      )
    );
  };

  const addIngredientRow = () => {
    setIngredients((prev) => [...prev, { ingredient: "", amount: 1 }]);
  };

  const removeIngredientRow = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImageMutation = useMutation({
    mutationFn: async () => {
      const res = await api.uploadDishImage(fileImage);
      return res;
    },
  });

  const dishMutation = useMutation({
    mutationFn: (reqData) => api.addDish(reqData),
    onSuccess: () => {
      setIsAddDishesModalOpen(false);
      enqueueSnackbar("Thêm món thành công!", { variant: "success" });
    },
    onError: (err) => {
      enqueueSnackbar("Thêm món thất bại!", { variant: "error" });
      console.error(err);
    },
  });

  useEffect(() => {
    const selectedCategory = categoryData?.categories?.find(cat => cat._id === dishData.category);
    if (selectedCategory && selectedCategory.isMenu) {
      setMenuType(selectedCategory.menuType);
      if (selectedCategory.menuType === "buffet") {
        setDishData(prev => ({ ...prev, price: 0 }));
      }
    } else {
      setMenuType("");
    }
  }, [dishData.category, categoryData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dishData.category) {
      enqueueSnackbar("Vui lòng chọn danh mục!", { variant: "warning" });
      return;
    }

    let finalData = { ...dishData };

    if (fileImage) {
      try {
        const res = await uploadImageMutation.mutateAsync(fileImage);
        finalData.image = res.imageUrl;
      } catch (err) {
        enqueueSnackbar("Tải ảnh lên thất bại!", { variant: "error" });
        return;
      }
    }

    finalData.ingredients = ingredients.filter(
      (item) => item.ingredient && item.amount > 0
    );

    dishMutation.mutate(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative max-h-[80vh] flex flex-col"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Thêm món ăn</h2>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto no-scrollbar pr-2" style={{ flexGrow: 1 }}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Tên món</label>
            <input
              type="text"
              name="name"
              value={dishData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
              placeholder="Nhập tên món"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Danh mục</label>
            <select
              name="category"
              value={dishData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categoryData?.categories?.filter((cat) => cat.isMenu === true).map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.menuType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Giá</label>
            <input
              type="number"
              name="price"
              value={dishData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
              placeholder="Nhập giá"
              disabled={!dishData.category || menuType === "buffet"}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Thuế (%)</label>
            <input
              type="number"
              name="tax"
              value={dishData.tax}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
              placeholder="Nhập thuế (VD: 10)"
              disabled={!dishData.category || menuType === "buffet"}
              min="0"
              max="100"
            />
          </div>



          <div>
            <label className="block mb-1 font-medium text-gray-700">Trạng thái</label>
            <select
              name="status"
              value={dishData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
            >
              <option value="available">Hiển thị</option>
              <option value="unavailable">Ẩn</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={dishData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
              rows="3"
              placeholder="Mô tả món ăn"
            />
          </div>

          {menuType === "buffet" && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">Loại</label>
              <input
                type="text"
                name="type"
                value={dishData.type || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-gray-700"
                placeholder="Nhập loại (VD: thịt, hải sản, rau...)"
                required
              />
            </div>
          )}


          <div>
            <label className="block mb-1 font-medium text-gray-700">Ảnh món ăn</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          {/* Nguyên liệu */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Nguyên liệu</label>
            {ingredients.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <select
                  value={item.ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, "ingredient", e.target.value)
                  }
                  className="border rounded px-2 py-1 w-2/3 text-gray-700"
                >
                  <option value="">-- Chọn nguyên liệu --</option>
                  {ingredientData?.ingredients?.map((ing) => (
                    <option key={ing._id} value={ing._id}>
                      {ing.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                  className="border rounded px-2 py-1 w-1/3 text-gray-700"
                  placeholder="Số lượng"
                />

                <button
                  type="button"
                  onClick={() => removeIngredientRow(index)}
                  className="text-red-500 font-bold"
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredientRow}
              className="text-blue-600 mt-2"
            >
              + Thêm nguyên liệu
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2 rounded border text-gray-700 hover:bg-gray-100"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDishesModal;
