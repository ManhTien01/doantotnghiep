import React from 'react';

const MiniCard = ({ title, icon, number, footerNum }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className='bg-[#1a1a1a] py-3 px-5 rounded-lg w-[50%]'>
      <div className='flex items-start justify-between'>
        <h3 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>{title}</h3>
        <button className={`${title === "Doanh thu" ? "bg-[#02ca3a]" : "bg-[#f6b100]"} p-3 rounded-lg text-[#f5f5f5] text-lg`}>
          {icon}
        </button>
      </div>
      <div>
        <h3 className='text-[#f5f5f5] text-2xl font-bold mt-2'>
          {title === "Doanh thu" ? formatCurrency(number) : number}
        </h3>
        <h1 className='text-[#f5f5f5] text-sm mt-2'>
          <span className='text-[#02ca3a]'>{footerNum}%</span> so với hôm qua
        </h1>
      </div>
    </div>
  );
};

export default MiniCard;
