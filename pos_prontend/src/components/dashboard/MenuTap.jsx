import React, { useEffect, useState } from "react";
import api from "../../https";
import EditDishModal from "./EditDishModal";
import { IoMdCreate, IoMdTrash, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { enqueueSnackbar } from "notistack";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MenuTab = () => {
  const queryClient = useQueryClient();

  const [dishSearch, setDishSearch] = useState("");
  const [dishPage, setDishPage] = useState(1);
  const [limit] = useState(5);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);

  // Query lấy danh sách món ăn
  const {
    data: dishesData,
    isLoading: dishesLoading,
    isError: dishesError,
  } = useQuery({
    queryKey: ["dishes", { search: dishSearch, page: dishPage, limit }],
    queryFn: () => api.getDishes({ search: dishSearch, page: dishPage, limit }),
    keepPreviousData: true,
  });

  // Query lấy danh mục món
  const {
    data: categoriesData,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories({ search: "", page: 1, limit: 100 }),
  });

  // Query lấy nguyên liệu
  const {
    data: ingredientsData,
  } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => api.getIngredients({ search: "", page: 1, limit: 100 }),
  });

  // Mutation xoá món ăn
  const deleteDishMutation = useMutation({
    mutationFn: (id) => api.deleteDish(id),
    onSuccess: () => {
      enqueueSnackbar("Xoá món thành công!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
    onError: () => {
      enqueueSnackbar("Xoá món ăn thất bại.", { variant: "error" });
    },
  });

  // Mutation cập nhật trạng thái món
  const toggleDishStatusMutation = useMutation({
    mutationFn: ({ id, updatedDish }) => api.updateDish(id, updatedDish),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
    onError: () => {
      enqueueSnackbar("Cập nhật trạng thái món thất bại.", { variant: "error" });
    },
  });

  // Mutation cập nhật món ăn
  const updateDishMutation = useMutation({
    mutationFn: ({ id, updatedData }) => api.updateDish(id, updatedData),
    onSuccess: () => {
      setIsDishModalOpen(false);
      setSelectedDish(null);
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      enqueueSnackbar("Cập nhật món thành công!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Cập nhật món ăn thất bại.", { variant: "error" });
    },
  });

  const handleDeleteDish = (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá món này?")) return;
    deleteDishMutation.mutate(id);
  };

  const handleEditDishClick = (dish) => {
    setSelectedDish(dish);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (id, updatedData) => {
    updateDishMutation.mutate({ id, updatedData });
  };

  const toggleDishStatus = (dish) => {
    toggleDishStatusMutation.mutate({
      id: dish._id,
      updatedDish: { ...dish, isAvailable: !dish.isAvailable },
    });
  };

  const getCategoryName = (catId) => {
    return (
      categoriesData?.categories.find((c) => c._id === catId)?.name ||
      "Không xác định"
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh sách món ăn</h2>
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={dishSearch}
          onChange={(e) => {
            setDishSearch(e.target.value);
            setDishPage(1);
          }}
          className="border rounded-lg px-3 py-1 w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tên món</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {dishesData?.dishes.length > 0 ? (
              dishesData.dishes.map((dish, index) => (
                <tr key={dish._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(dishPage - 1) * limit + index + 1}</td>
                  <td className="px-4 py-2">{dish.name}</td>
                  <td className="px-4 py-2">{dish.price.toLocaleString()} đ</td>
                  <td className="px-4 py-2">{getCategoryName(dish.category._id)}</td>
                  <td className="px-4 py-2">{dish.isAvailable ? "Hiển thị" : "Ẩn"}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => toggleDishStatus(dish)}
                    >
                      {dish.isAvailable ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditDishClick(dish)}
                    >
                      <IoMdCreate size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteDish(dish._id)}
                    >
                      <IoMdTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có món ăn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          disabled={dishPage <= 1}
          onClick={() => setDishPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1 border rounded">
          {dishPage} / {dishesData?.totalPages || 1}
        </span>
        <button
          disabled={dishPage >= (dishesData?.totalPages || 1)}
          onClick={() => setDishPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {isDishModalOpen && (
        <EditDishModal
          isOpen={isDishModalOpen}
          onClose={() => {
            setIsDishModalOpen(false);
            setSelectedDish(null);
          }}
          data={selectedDish}
          onSave={handleSaveDish}
          categories={categoriesData?.categories || []}
          ingredientData={ingredientsData?.ingredients || []}
        />
      )}
    </div>
  );
};

export default MenuTab;
