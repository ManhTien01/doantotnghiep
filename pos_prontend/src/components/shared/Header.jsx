import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../https";
import { removeUser } from "../../redux/slices/userSlice";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-[#1a1a1a] px-4 py-3 md:px-8">
      {/* Top row */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-xl font-bold text-[#f5f5f5]">Yummy.</h1>
        </div>

        {/* Search bar - visible on md+ */}
        <div className="hidden md:flex items-center gap-3 bg-[#1f1f1f] rounded-[15px] px-5 py-2 w-[400px] lg:w-[500px]">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full"
          />
        </div>

        {/* Desktop user info */}
        <div className="hidden md:flex items-center gap-4">
          {userData.role === "admin" && (
            <div
              onClick={() => navigate("/dashboard")}
              className="bg-[#1f1f1f] rounded-full p-3 cursor-pointer"
              title="Dashboard"
            >
              <MdDashboard className="text-[#f5f5f5] text-2xl" />
            </div>
          )}
          <div
            className="bg-[#1f1f1f] rounded-full p-3 cursor-pointer"
            title="Notifications"
          >
            <FaBell className="text-[#f5f5f5] text-2xl" />
          </div>
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-[#f5f5f5] text-4xl" />
            <div className="flex flex-col items-start">
              <h1 className="text-md text-[#f5f5f5] font-semibold">
                {userData.name || "TEST USER"}
              </h1>
              <p className="text-xs text-[#ababab] font-medium">
                {userData.role || "Role"}
              </p>
            </div>
            <IoLogOut
              onClick={handleLogout}
              className="text-[#f5f5f5] ml-2 cursor-pointer"
              size={35}
              title="Logout"
            />
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="text-[#f5f5f5] text-2xl"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {showMobileMenu && (
        <div className="md:hidden mt-4 space-y-3 bg-[#1f1f1f] p-4 rounded-xl">
          {/* Search */}
          <div className="flex items-center gap-3 bg-[#2b2b2b] rounded-[15px] px-4 py-2">
            <FaSearch className="text-[#f5f5f5]" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-[#f5f5f5] w-full"
            />
          </div>

          {/* Dashboard (Admin only) */}
          {userData.role === "Admin" && (
            <button
              onClick={() => {
                navigate("/dashboard");
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 text-[#f5f5f5]"
            >
              <MdDashboard className="text-xl" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Notifications */}
          <button className="flex items-center gap-2 text-[#f5f5f5]">
            <FaBell className="text-xl" />
            <span>Thông báo</span>
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 mt-2">
            <FaUserCircle className="text-[#f5f5f5] text-3xl" />
            <div>
              <h1 className="text-[#f5f5f5] font-semibold text-sm">
                {userData.name || "TEST USER"}
              </h1>
              <p className="text-[#ababab] text-xs">{userData.role || "Role"}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#f5f5f5] mt-3"
          >
            <IoLogOut className="text-xl" />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
