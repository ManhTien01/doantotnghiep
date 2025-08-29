import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import MenuContainer from "../components/menu/MenuContainer";
import CartInfo from "../components/menu/CartInfor";
import Bill from "../components/menu/Bill";
import api from "../https";

const Menu = () => {
  const customerData = useSelector((state) => state.customer);

  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTableId = searchParams.get("tableId");

  const { data: currentTableData } = useQuery({
    queryKey: ["tableInfo", currentTableId],
    queryFn: async () => {
      const res = await api.getTableById(currentTableId);
      return res.data;
    },
    enabled: !!currentTableId,
  });

  const [showCartMobile, setShowCartMobile] = useState(false);
  const toggleCartMobile = () => setShowCartMobile((prev) => !prev);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3 relative">
      {/* Phần Menu (trái) */}
      <div className="flex-[3]">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Menu</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {customerData.customerName || "Customer Name"}
                </h1>
                <p className="text-xs text-[#ababab] font-medium">
                  Bàn {customerData.table || "N/A"} - khách {customerData.guests || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <MenuContainer currentTurn={currentTableData?.currentTurn ?? -1} menuType={customerData?.menuType} />
      </div>

      {/* Phần Cart + Bill - desktop */}
      <div className="hidden sm:flex flex-[2] bg-[#1a1a1a] mt-4 mr-3 h-[780px] rounded-lg pt-2">
        <div className="w-full">
          <CartInfo />
          <hr className="border-[#2a2a2a] border-t-2" />
          <Bill />
        </div>
      </div>

      {/* Cart + Bill - mobile (overlay + animation) */}
      <div
        className={`sm:hidden fixed inset-0 z-50 bg-[#1a1a1a] p-4 transition-transform duration-300 ease-in-out ${
          showCartMobile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Nút đóng */}
        <button
          onClick={toggleCartMobile}
          className="absolute top-4 right-4 text-yellow-500 text-2xl"
          aria-label="Đóng giỏ hàng"
        >
          <FaTimes />
        </button>

        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2 my-2" />
        <Bill />
      </div>

      {/* Nút mở cart (chỉ mobile) */}
      {!showCartMobile && (
        <button
          onClick={toggleCartMobile}
          className="sm:hidden fixed bottom-16 right-4 bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg z-50"
          aria-label="Mở giỏ hàng"
        >
          <FaShoppingCart size={24} />
        </button>
      )}

      <BottomNav />
    </section>
  );
};

export default Menu;
