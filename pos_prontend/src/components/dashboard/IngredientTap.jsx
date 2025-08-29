import React, { useEffect, useState } from "react";
import api from "../../https"; // API wrapper
import EditIngredientModal from "./EditIngredientModal"; // Modal sửa nguyên liệu
import { MdEdit, MdDelete } from "react-icons/md";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const res = await api.getIngredients({ search, page, limit });
      setIngredients(res.ingredients);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Lỗi lấy danh sách nguyên liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories để chọn trong modal
  const fetchCategories = async () => {
    try {
      const res = await api.getCategories(); // Giả sử api này có
      setCategories(res.categories || []);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nguyên liệu này không?")) return;
    try {
      await api.deleteIngredient(id);
      await fetchIngredients();
    } catch (err) {
      console.error("Lỗi xóa nguyên liệu:", err);
      alert("Xóa nguyên liệu thất bại.");
    }
  };

  const handleEditClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  // onSave(id, data) theo model bạn đã cho
  const handleUpdate = async (id, updatedData) => {
    try {
      await api.updateIngredient(id, updatedData);
      setIsModalOpen(false);
      setSelectedIngredient(null);
      await fetchIngredients();
    } catch (err) {
      console.error("Lỗi cập nhật nguyên liệu:", err);
      alert("Cập nhật nguyên liệu thất bại.");
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, [search, page]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Danh sách nguyên liệu</h1>
        <input
          type="text"
          placeholder="Tìm kiếm nguyên liệu..."
          className="border rounded-lg px-3 py-1 w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">Tên nguyên liệu</th>
            <th className="px-4 py-3">Số lượng</th>
            <th className="px-4 py-3">Đơn vị</th>
            <th className="px-4 py-3">Loại</th>
            <th className="px-4 py-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="text-center py-4">Đang tải...</td></tr>
          ) : ingredients.length > 0 ? (
            ingredients.map((ing) => (
              <tr key={ing._id} className="border-t bg-white">
                <td className="px-4 py-2">{ing.name}</td>
                <td className="px-4 py-2">{ing.quantity}</td>
                <td className="px-4 py-2">
                  {ing.type === "count" ? "--" : ing.unit || "--"}
                </td>
                <td className="px-4 py-2 capitalize">{ing.type}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    title="Chỉnh sửa"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(ing)}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    title="Xóa"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(ing._id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center py-4">Không có nguyên liệu nào.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1 border rounded">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Modal chỉnh sửa */}
      <EditIngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedIngredient}
        onSave={handleUpdate}
        categories={categories}
      />
    </div>
  );
};

export default Ingredients;
