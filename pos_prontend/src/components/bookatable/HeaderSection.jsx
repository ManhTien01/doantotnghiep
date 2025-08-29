import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiChevronDown, BiMenu } from 'react-icons/bi';

const menuItems = [
  { href: '#hero', label: 'Trang chủ' },
  { href: '#about', label: 'Thông tin' },
  { href: '#menu', label: 'Menu' },
  { href: '#events', label: 'Sự kiện' },
  { href: '#gallery', label: 'Check-in' },
  { href: '#contact', label: 'Liên hệ' },
];

const dropdownItems = [
  { to: '/auth', label: 'Đăng nhập' },
  { to: '/auth', label: 'Đăng ký' },
];

const HeaderSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderDropdown = () => (
    isDropdownOpen && (
      <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10 py-2">
        {dropdownItems.map(({ to, label }) => (
          <li key={label}>
            <Link to={to} className="block px-4 py-2 hover:bg-gray-100">{label}</Link>
          </li>
        ))}
      </ul>
    )
  );

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center text-2xl font-bold text-yellow-500">
          <h1 className="text-2xl font-extrabold">Yummy</h1>
          <span className="text-yellow-500 text-3xl">.</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex space-x-6 items-center">
          {menuItems.map(({ href, label }) => (
            <a key={label} href={href} className="text-gray-700 hover:text-yellow-500">
              {label}
            </a>
          ))}

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 hover:text-yellow-500 focus:outline-none"
              aria-expanded={isDropdownOpen}
            >
              <span>Thành viên</span>
              <BiChevronDown className="ml-1 h-4 w-4" />
            </button>
            {renderDropdown()}
          </div>
        </nav>

        {/* Đặt bàn button */}
        <a
          href="#book-a-table"
          className="hidden xl:inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Đặt bàn
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden text-gray-700 focus:outline-none"
        >
          <BiMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            {menuItems.map(({ href, label }) => (
              <a key={label} href={href} className="text-gray-700 hover:text-yellow-500">
                {label}
              </a>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-yellow-500 focus:outline-none"
              >
                <span>Thành viên</span>
                <BiChevronDown className="ml-1 h-4 w-4" />
              </button>
              {renderDropdown()}
            </div>

            <a
              href="#book-a-table"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-2 text-center hover:bg-yellow-600"
            >
              Đặt bàn
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderSection;
