import React from "react";

const Header = ({ isMerged, setIsMerged, setIsModalOpen }) => (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold text-white">Chi tiết đơn hàng</h1>
    <div className="flex gap-3">
      <button
        onClick={() => setIsMerged((prev) => !prev)}
        className={`p-2 rounded-full ${isMerged ? "bg-yellow-500 text-black" : "bg-zinc-800 text-white"} hover:bg-zinc-700`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="4" rx="1" />
          <rect x="3" y="14" width="18" height="4" rx="1" />
        </svg>
      </button>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-full bg-indigo-600 text-white hover:bg-zinc-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="9" y1="4" x2="9" y2="20" />
          <line x1="15" y1="4" x2="15" y2="20" />
        </svg>
      </button>
    </div>
  </div>
);

export default Header;
