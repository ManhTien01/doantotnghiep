import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { FaMapMarker } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import AddTableModal from "../components/dashboard/AddTableModal";
import AddCategoryModal from "../components/dashboard/AddCategoryModal";
import AddDishesModal from "../components/dashboard/AddDishesModal";
import ModalArea from "../components/dashboard/ModalArea";
import Reservation from "../components/dashboard/Reservation";
import Users from "../components/dashboard/Users";
import CategoryTab from "../components/dashboard/CategoryTab";
import AddIngredientsModal from "../components/dashboard/AddIngredientsModal";
import Ingredients from "../components/dashboard/IngredientTap";
import MenuTab from "../components/dashboard/MenuTap";

const buttons = [
  { label: "Thêm khu vực", icon: <FaMapMarker />, action: "area" },
  { label: "Thêm bàn", icon: <MdTableBar />, action: "table" },
  { label: "Thêm danh mục món", icon: <MdCategory />, action: "category" },
  { label: "Thêm món", icon: <BiSolidDish />, action: "dishes" },
  { label: "Thêm nguyên liệu", icon: <FaCartPlus />, action: "ingredients" },
];

const tabs = ["Tổng quan", "Đơn gọi món", "Hoá đơn thanh toán", "Bàn đặt", "Người dùng", "Danh mục món", "Thực đơn", "Nguyên liệu"];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddDishesModalOpen, setIsAddDishesModalOpen] = useState(false);
  const [isAddIngredientsModalOpen, setIsAddIngredientsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
    if (action === "area") setIsAreaModalOpen(true);
    if (action === "category") setIsAddCategoryModalOpen(true);
    if (action === "dishes") setIsAddDishesModalOpen(true);
    if (action === "ingredients") setIsAddIngredientsModalOpen(true);
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] text-white flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-60 pl-10 pt-6 gap-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Chức năng</h2>
        {buttons.map(({ label, icon, action }) => (
          <button
            key={label}
            onClick={() => handleOpenModal(action)}
            className="bg-[#1a1a1a] hover:bg-[#333] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 py-6">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white text-2xl">
            {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2a2a2a] rounded-lg p-4 mb-6 space-y-4 shadow-lg">
            {/* Action Buttons */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Chức năng</h3>
              <div className="flex flex-col gap-2">
                {buttons.map(({ label, icon, action }) => (
                  <button
                    key={label}
                    onClick={() => handleOpenModal(action)}
                    className="bg-[#1a1a1a] hover:bg-[#333] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Tabs</h3>
              <div className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleSelectTab(tab)}
                    className={`text-left px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      activeTab === tab
                        ? "bg-[#262626] text-white"
                        : "bg-[#1a1a1a] hover:bg-[#262626] text-[#f5f5f5]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs (Desktop) */}
        <div className="hidden md:flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-[#262626] text-white"
                  : "bg-[#1a1a1a] hover:bg-[#262626] text-[#f5f5f5]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Tổng quan" && <Metrics />}        
        {activeTab === "Đơn gọi món" && <RecentOrders />}        
        {activeTab === "Bàn đặt" && <Reservation />}        
        {activeTab === "Người dùng" && <Users />}        
        {activeTab === "Danh mục món" && <CategoryTab />}        
        {activeTab === "Thực đơn" && <MenuTab />}        
        {activeTab === "Nguyên liệu" && <Ingredients />}        
        {activeTab === "Hoá đơn thanh toán" && (
          <div className="text-gray-300 text-lg">Payment Component Coming Soon</div>
        )}
      </div>

      {/* Modals */}
      {isTableModalOpen && <AddTableModal setIsTableModalOpen={setIsTableModalOpen} />}
      {isAreaModalOpen && <ModalArea setIsAreaModalOpen={setIsAreaModalOpen} />}
      {isAddCategoryModalOpen && <AddCategoryModal setIsAddCategoryModalOpen={setIsAddCategoryModalOpen} />}
      {isAddDishesModalOpen && <AddDishesModal setIsAddDishesModalOpen={setIsAddDishesModalOpen} />}
      {isAddIngredientsModalOpen && <AddIngredientsModal setIsAddIngredientsModalOpen={setIsAddIngredientsModalOpen} />}

    </div>
  );
};

export default Dashboard;