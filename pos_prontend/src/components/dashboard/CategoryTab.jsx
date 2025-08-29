import React, { useEffect, useState } from "react";
import api from "../../https";
import EditCategoryModal from "./EditCategoryModal";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import { enqueueSnackbar } from "notistack";

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(""); // "" | "menu" | "ingredient"
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Lấy danh mục theo filter
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories({ search, page, limit, type });
      setCategories(res.categories || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
      enqueueSnackbar("Lấy danh mục thất bại!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await api.deleteCategory(id);
      enqueueSnackbar("Xóa danh mục thành công!", { variant: "success" });
      await fetchCategories();
    } catch (err) {
      console.error("Lỗi xóa danh mục:", err);
      enqueueSnackbar("Xóa danh mục thất bại!", { variant: "error" });
    }
  };

  // Mở modal chỉnh sửa danh mục
  const handleEditCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  // Lưu danh mục sau khi chỉnh sửa
  const handleSaveCategory = async (updatedCategory) => {
    try {
      await api.updateCategory(updatedCategory._id, {
        name: updatedCategory.name,
        isMenu: updatedCategory.isMenu,
        menuType: updatedCategory.menuType,
      });
      enqueueSnackbar("Sửa danh mục thành công!", { variant: "success" });
      setIsCategoryModalOpen(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      enqueueSnackbar("Cập nhật danh mục thất bại!", { variant: "error" });
    }
  };

  // Cập nhật lại danh sách khi thay đổi search, page, hoặc type
  useEffect(() => {
    fetchCategories();
  }, [search, page, type]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh mục</h2>

        {/* Bộ lọc loại danh mục */}
        <div className="flex gap-2">
          {["", "menu", "ingredient"].map((filterType) => {
            const label = filterType === "" ? "Tất cả" : filterType === "menu" ? "Menu" : "Thực phẩm";
            return (
              <button
                key={filterType}
                onClick={() => {
                  setType(filterType);
                  setPage(1);
                }}
                className={`px-4 py-1 rounded border ${
                  type === filterType ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-1 w-64"
        />
      </div>

      {/* Bảng danh mục */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tên danh mục</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat, index) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">{cat.isMenu ? "Menu" : "Thực phẩm"}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditCategoryClick(cat)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Chỉnh sửa"
                    >
                      <IoMdCreate size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Xóa"
                    >
                      <IoMdTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Không có danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1 border rounded">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Modal chỉnh sửa danh mục */}
      {isCategoryModalOpen && (
        <EditCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setSelectedCategory(null);
          }}
          data={selectedCategory}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
};

export default CategoryTab;
