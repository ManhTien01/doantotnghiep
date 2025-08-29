import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Nền tối mờ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative bg-white text-black rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] mx-4 z-10 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            className="text-gray-500 text-2xl hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Nội dung có thể cuộn */}
        <div className="p-6 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(80vh - 72px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
