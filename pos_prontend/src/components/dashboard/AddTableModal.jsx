import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../https";
import { enqueueSnackbar } from "notistack";

const AddTableModal = ({ setIsTableModalOpen }) => {
  const [tableData, setTableData] = useState({
    area: "",
    tableNo: "",
    seats: "",
  });

  // Lấy danh sách khu vực
  const { data: areasData } = useQuery({
    queryKey: ["areas"],
    queryFn: () => api.getAreas(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableData.area) {
      enqueueSnackbar("Vui lòng chọn khu vực!", { variant: "warning" });
      return;
    }
    tableMutation.mutate(tableData);
  };

  const handleCloseModal = () => {
    setIsTableModalOpen(false);
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => api.addTable(reqData),
    onSuccess: () => {
      setIsTableModalOpen(false);
      enqueueSnackbar("Thêm bàn thành công!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar("Thêm bàn thất bại!", { variant: "error" });
      console.log(error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          aria-label="Close modal"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">Thêm bàn</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Khu vực</label>
            <select
              name="area"
              value={tableData.area}
              onChange={handleInputChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Chọn khu vực --</option>
              {areasData?.data?.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Số bàn</label>
            <input
              type="number"
              name="tableNo"
              value={tableData.tableNo}
              onChange={handleInputChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số bàn"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Số chỗ ngồi</label>
            <input
              type="number"
              name="seats"
              value={tableData.seats}
              onChange={handleInputChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số chỗ ngồi"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Thêm
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTableModal;
