import React, { useState, useEffect } from "react";
import Modal from "../shared/Modal";

const EditIngredientModal = ({ isOpen, onClose, onSave, data, categories = [] }) => {
  const [form, setForm] = useState({
    name: "",
    type: "count", // default
    quantity: 0,
    category: "",
    unit: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        type: data.type || "count",
        quantity: data.quantity || 0,
        category: data.category?._id || data.category || "",
        unit: data.unit || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu người dùng đổi 'type', reset unit cho phù hợp
    if (name === "type") {
      setForm((prev) => ({
        ...prev,
        type: value,
        unit: value === "count" ? "" : prev.unit || "g", // default unit nếu weight là "g"
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "quantity" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async () => {
    // Validation theo schema:
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên nguyên liệu.");
      return;
    }
    if (!["count", "weight"].includes(form.type)) {
      alert("Loại nguyên liệu không hợp lệ.");
      return;
    }
    if (form.quantity < 0) {
      alert("Số lượng phải lớn hơn hoặc bằng 0.");
      return;
    }
    if (form.type === "weight" && !["g", "kg", "ml", "l"].includes(form.unit)) {
      alert("Đơn vị không hợp lệ cho loại nguyên liệu cân đo.");
      return;
    }
    if (form.type === "count" && form.unit !== "") {
      alert("Đơn vị phải để trống cho loại nguyên liệu đếm được.");
      return;
    }

    await onSave(data._id, form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa nguyên liệu">
      <div className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên nguyên liệu"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="count">Đếm được (Count)</option>
          <option value="weight">Cân đo (Weight)</option>
        </select>

        <input
          name="quantity"
          type="number"
          min={0}
          value={form.quantity}
          onChange={handleChange}
          placeholder="Số lượng tồn kho"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Nếu type = weight thì show đơn vị, ngược lại hide hoặc disable */}
        {form.type === "weight" && (
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn đơn vị --</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>
        )}
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">
          Hủy
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
          Lưu
        </button>
      </div>
    </Modal>
  );
};

export default EditIngredientModal;
