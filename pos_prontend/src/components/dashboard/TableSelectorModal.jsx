import React, { useState, useMemo, useEffect } from "react";

const TableSelectorModal = ({ isOpen, tables, onSelect, onClose, initialSelected = [] }) => {
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedTables, setSelectedTables] = useState([]);

    useEffect(() => {
        setSelectedTables(initialSelected);
    }, [initialSelected]);

    const areas = useMemo(() => {
        const unique = [...new Set(tables.map((t) => t.area.area))];
        return unique;
    }, [tables]);

    const filteredTables = useMemo(() => {
        if (!selectedArea) return tables;
        return tables.filter((t) => t.area.area === selectedArea);
    }, [tables, selectedArea]);

    const toggleSelectTable = (table) => {
        const isSelected = selectedTables.find(t => t._id === table._id);
        if (isSelected) {
            setSelectedTables(prev => prev.filter(t => t._id !== table._id));
        } else {
            setSelectedTables(prev => [...prev, table]);
        }
    };

    const isTableSelected = (tableId) => {
        return selectedTables.some(t => t._id === tableId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] flex flex-col"
                style={{ minHeight: 'auto' }}
            >
                <h2 className="text-xl font-semibold mb-4 text-black">Chọn bàn theo khu vực</h2>

                {/* Tabs khu vực */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setSelectedArea(null)}
                        className={`px-3 py-1 rounded-full border ${
                            selectedArea === null ? "bg-blue-500 text-white" : "bg-blue-400 hover:bg-blue-500"
                        }`}
                    >
                        Tất cả
                    </button>
                    {areas.map((area) => (
                        <button
                            key={area}
                            onClick={() => setSelectedArea(area)}
                            className={`px-3 py-1 rounded-full border ${
                                selectedArea === area ? "bg-blue-500 text-white" : "bg-blue-400 hover:bg-blue-500"
                            }`}
                        >
                            {area}
                        </button>
                    ))}
                </div>

                {/* Danh sách bàn */}
                <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-auto"
                    style={{ maxHeight: 'calc(90vh - 200px)' }}
                >
                    {filteredTables.map((table) => {
                        const selected = isTableSelected(table._id);
                        return (
                            <button
                                key={table._id}
                                onClick={() => toggleSelectTable(table)}
                                className={`border p-4 rounded shadow hover:bg-blue-50 ${
                                    selected ? "border-blue-600 bg-blue-100" : ""
                                }`}
                            >
                                <p className="font-bold text-gray-700">Bàn {table.tableNo}</p>
                                <p className="text-sm text-gray-500">Ghế: {table.seats}</p>
                                {selected && <p className="text-sm text-blue-600 font-medium">Đã chọn</p>}
                            </button>
                        );
                    })}
                </div>

                {/* Nút xác nhận & đóng */}
                <div className="mt-6 text-right flex justify-end gap-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onSelect(selectedTables)}
                        className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableSelectorModal;
