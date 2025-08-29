import React, { useState, useEffect } from "react";
import Modal from "../shared/Modal";

const EditDishModal = ({
  isOpen,
  onClose,
  onSave,
  data,
  categories = [],
  ingredientData = [],
}) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    tax: 0,
    description: "",
    image: "",
    category: "",
    status: "available",
    ingredients: [],
    type: "",
  });

  const currentCategory = categories.find(cat => cat._id === form.category);
  const isBuffet = currentCategory?.menuType === "buffet";
  const [fileImage, setFileImage] = useState(null);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        price: data.price || 0,
        tax: data.tax || 0,
        description: data.description || "",
        image: data.image || "",
        category: data.category?._id || data.category || "",
        status: data.status || "available",
        ingredients: data.ingredients || [],
        type: data.type || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...form.ingredients];
    updated[index] = {
      ...updated[index],
      [field]: field === "amount" ? Number(value) : value,
    };
    setForm((prev) => ({
      ...prev,
      ingredients: updated,
    }));
  };

  const addIngredientRow = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: "", amount: 1 }],
    }));
  };

  const removeIngredientRow = (index) => {
    const updated = [...form.ingredients];
    updated.splice(index, 1);
    setForm((prev) => ({
      ...prev,
      ingredients: updated,
    }));
  };

  const handleSubmit = () => {
    if (!form.name || form.price == null || !form.category) {
      alert("Vui lòng nhập đầy đủ tên món, giá và danh mục!");
      return;
    }

    const cleanedIngredients = form.ingredients.filter(
      (item) => item.ingredient && item.amount > 0
    );

    onSave(data._id, {
      ...form,
      ingredients: cleanedIngredients,
      fileImage,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa món ăn">
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Tên món</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên món"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Danh mục</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories
              ?.filter((cat) => cat.isMenu)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.menuType})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Giá</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập giá"
            disabled={isBuffet} 
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Thuế (%)</label>
          <input
            type="number"
            name="tax"
            value={form.tax}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="VD: 10"
            disabled={isBuffet} 
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="available">Hiển thị</option>
            <option value="unavailable">Ẩn</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
          />
        </div>

        {isBuffet && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">Loại</label>
              <input
                type="text"
                name="type"
                value={form.type || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-gray-700"
                placeholder="Nhập loại (VD: thịt, hải sản, rau...)"
                required
              />
            </div>
          )}

        <div>
          <label className="block font-medium mb-1">Ảnh món ăn</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          {form.image && (
            <img
              src={form.image}
              alt="dish preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Nguyên liệu</label>
          {form.ingredients.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <select
                value={item.ingredient}
                onChange={(e) =>
                  handleIngredientChange(index, "ingredient", e.target.value)
                }
                className="border rounded px-2 py-1 w-2/3"
              >
                <option value="">-- Chọn nguyên liệu --</option>
                {ingredientData?.map((ing) => (
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
                className="border rounded px-2 py-1 w-1/3"
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
            className="text-blue-600"
          >
            + Thêm nguyên liệu
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditDishModal;
