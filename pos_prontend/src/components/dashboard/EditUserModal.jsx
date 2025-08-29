import React, { useState, useEffect, useRef } from "react";

const EditUserModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    active: false,
  });

  const nameInputRef = useRef(null);

  // Khi modal mở hoặc data thay đổi, set dữ liệu vào form và focus vào input tên
  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        active: !!data.active,
      });
      // Delay focus 1 tick để đảm bảo input đã render
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    }
  }, [data, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Tên không được để trống.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email không được để trống.");
      return;
    }

    onSave({ ...data, ...formData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">Chỉnh sửa người dùng</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Tên</label>
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn vai trò</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-5 w-5 accent-blue-600 cursor-pointer"
            />
            <label htmlFor="active" className="font-medium text-gray-700 cursor-pointer">
              Kích hoạt
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
