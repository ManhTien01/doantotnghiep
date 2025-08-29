import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useQuery } from "@tanstack/react-query";
import api from "../../https";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTable, setSelectedTable] = useState({ id: "", tableNo: "" });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: tablesData } = useQuery({
    queryKey: ["availableTables"],
    queryFn: () => api.getTablesByStatus("Available"),
    enabled: isModalOpen,
  });

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  };

  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name, phone, guests: guestCount, table: selectedTable.tableNo }));
    navigate(`/menu?tableId=${selectedTable.id}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#262626] pt-2 pb-2 px-2">
      <div className="flex justify-around items-center gap-2">
        {[
          { label: "Trang chủ", icon: <FaHome size={20} />, path: "/" },
          { label: "Đơn hàng", icon: <MdOutlineReorder size={20} />, path: "/orders" },
          { label: "Bàn ăn", icon: <MdTableBar size={20} />, path: "/tables" },
          { label: "Khác", icon: <CiCircleMore size={20} />, path: "/more", disabled: true },
        ].map(({ label, icon, path, disabled }) => (
          <button
            key={label}
            onClick={() => !disabled && navigate(path)}
            className={`flex flex-col items-center justify-center text-xs font-semibold rounded-lg py-1 ${isActive(path) ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
              } flex-1`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <button
        disabled={isActive("/tables") || isActive("/menu")}
        onClick={openModal}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#F6B100] text-white rounded-full p-4 shadow-lg z-20"
      >
        <BiSolidDish size={30} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Tạo đơn mới">
        <div>
          <label className="block text-gray-700 mb-2 text-sm font-medium">Tên khách hàng</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-white border border-gray-300">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Nhập tên khách hàng"
              className="bg-transparent flex-1 text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 mt-3 text-sm font-medium">Số điện thoại</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-white border border-gray-300">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="VD: 0912345678"
              className="bg-transparent flex-1 text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-gray-700">Số khách</label>
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-300">
            <button onClick={decrement} className="text-yellow-500 text-2xl">&minus;</button>
            <span className="text-gray-800">{guestCount} khách</span>
            <button onClick={increment} className="text-yellow-500 text-2xl">&#43;</button>
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-gray-700">Chọn bàn</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-white border border-gray-300">
            <select
              value={selectedTable.id}
              onChange={(e) => {
                const selected = JSON.parse(e.target.value);
                setSelectedTable(selected);
              }}
              className="bg-transparent text-gray-900 w-full focus:outline-none"
              required
            >
              <option value="" disabled>Chọn bàn đang trống</option>
              {tablesData?.map((table) => (
                <option key={table._id} value={JSON.stringify({ id: table._id, tableNo: table.tableNo })}>
                  Bàn {table.tableNo} ({table.seats} chỗ)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCreateOrder}
          className="w-full bg-[#F6B100] text-white rounded-lg py-3 mt-8 hover:bg-yellow-700"
        >
          Tạo đơn
        </button>
      </Modal>

    </div>
  );
};

export default BottomNav;
