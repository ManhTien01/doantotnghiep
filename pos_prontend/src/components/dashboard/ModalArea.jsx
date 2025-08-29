import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import api from "../../https";
import { enqueueSnackbar } from "notistack";

const ModalArea = ({ setIsAreaModalOpen }) => {
  const [areaData, setAreaData] = useState({
    area: "",
    tables: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAreaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    areaMutation.mutate(areaData);
  };

  const handleCloseModal = () => {
    setIsAreaModalOpen(false);
  };

  const areaMutation = useMutation({
    mutationFn: (reqData) => api.addArea(reqData),
    onSuccess: () => {
      setIsAreaModalOpen(false);
      enqueueSnackbar("Thêm khu vực thành công!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar("Thêm khu vực thất bại!", { variant: "error" });
      console.error(error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black-50 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Thêm khu vực</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-700 hover:text-red-500 transition"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Tên khu vực</label>
            <input
              name="area"
              value={areaData.area}
              onChange={handleInputChange}
              className="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên khu vực"
              required
              autoFocus
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
              Thêm khu vực
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ModalArea;
