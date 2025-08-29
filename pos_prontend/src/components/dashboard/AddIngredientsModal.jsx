import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../https";
import { enqueueSnackbar } from "notistack";

const AddIngredientsModal = ({ setIsAddIngredientsModalOpen }) => {
    const [ingredientData, setIngredientData] = useState({
        name: "",
        type: "count", // mặc định
        quantity: 0,
        unit: "", // mặc định trống, chỉ dùng khi type = 'weight'
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Nếu là quantity thì ép kiểu số
        setIngredientData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    const handleCloseModal = () => {
        setIsAddIngredientsModalOpen(false);
    };

    const { data: categoryData } = useQuery({
        queryKey: ["ingredient-categories"],
        queryFn: () => api.getCategories({ search: "", page: 1, limit: 100 }),
    });

    const ingredientMutation = useMutation({
        mutationFn: (data) => api.createIngredient(data),
        onSuccess: () => {
            enqueueSnackbar("Thêm nguyên liệu thành công!", { variant: "success" });
            setIsAddIngredientsModalOpen(false);
        },
        onError: (err) => {
            enqueueSnackbar("Thêm nguyên liệu thất bại!", { variant: "error" });
            console.error(err);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra bắt buộc: nếu type = weight thì unit phải có giá trị
        if (ingredientData.type === "weight" && !ingredientData.unit) {
            enqueueSnackbar("Vui lòng chọn đơn vị khi loại là cân đo!", {
                variant: "warning",
            });
            return;
        }

        ingredientMutation.mutate(ingredientData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-6 text-gray-800">Thêm nguyên liệu</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Tên nguyên liệu</label>
                        <input
                            type="text"
                            name="name"
                            value={ingredientData.name}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            placeholder="Nhập tên nguyên liệu"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Loại nguyên liệu</label>
                        <select
                            name="type"
                            value={ingredientData.type}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        >
                            <option value="count">Đếm được</option>
                            <option value="weight">Cân đo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Số lượng tồn kho</label>
                        <input
                            type="number"
                            min="0"
                            name="quantity"
                            value={ingredientData.quantity}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                    </div>

                    {ingredientData.type === "weight" && (
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Đơn vị</label>
                            <select
                                name="unit"
                                value={ingredientData.unit}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-gray-700"
                                required
                            >
                                <option value="">-- Chọn đơn vị --</option>
                                <option value="g">gram (g)</option>
                                <option value="kg">kilogram (kg)</option>
                                <option value="ml">milliliter (ml)</option>
                                <option value="l">liter (l)</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Nhóm thực phẩm</label>
                        <select
                            name="category"
                            value={ingredientData.category}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        >
                            <option value="">-- Chọn nhóm --</option>
                            {categoryData?.categories
                                ?.filter((cat) => cat.isMenu === false)
                                ?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}

                        </select>
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

export default AddIngredientsModal;
