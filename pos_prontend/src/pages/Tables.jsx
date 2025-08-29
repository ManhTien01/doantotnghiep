import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import api from "../https"; // API update, delete
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeCustomer, setCustomer } from "../redux/slices/customerSlice";
import { removeAllItems } from "../redux/slices/cartSlice";
import { updateTableStatuses } from "../utils/tableUtils";
import { useTableModes, useTableFilters, useTableData } from "../hooks/useTableLogicHandler";
import TableInfoModal from "../components/tables/ModalTableInfor";



const Tables = () => {
    const {
        sourceTableId,
        targetTableId,
        selectedTables,
        isEditMode,
        isMergeMode,
        isTransferMode,
        showMobileMenu,
        showMenuOptions,
        setSelectedTables,
        setSourceTableId,
        setTargetTableId,
        setShowMobileMenu,
        setShowMenuOptions,
        toggleEditMode,
        toggleMergeMode,
        toggleTransferMode,
        resetMerge,
        resetTransfer,
    } = useTableModes();

    const {
        resData,
        isError,
        queryClient,
    } = useTableData();

    const {
        areaFilter,
        statusFilter,
        handleShowAll,
        handleAreaClick,
        handleStatusClick,
        uniqueAreas,
        filteredTables,
    } = useTableFilters(resData);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [menuType, setMenuType] = useState("alacart");

    useEffect(() => {
        document.title = "POS | Tables";
    }, []);

    useEffect(() => {
        updateTableStatuses();
    }, []);

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    // Xử lý chon bàn khi đang ở các chế độ khác nhau
    // 🟡 Xử lý khi ở chế độ gộp bàn

    const handleMergeTable = (table) => {
        const id = table._id;

        // ❌ Không cho chọn nếu bàn không phải "Occupied"
        if (table.status !== "Occupied") {
            enqueueSnackbar("Chỉ có thể gộp các bàn đang được sử dụng (Occupied)!", {
                variant: "warning",
            });
            return;
        }

        // ✅ Bước 1: Nếu chưa chọn bàn đích → chọn làm bàn đích
        if (!targetTableId) {
            setTargetTableId(id);
            setSourceTableId(id);
            enqueueSnackbar("Đã chọn bàn đích. Bây giờ hãy chọn các bàn nguồn để gộp vào.", {
                variant: "info",
            });
            return;
        }

        // ❌ Không cho chọn lại bàn đích làm bàn nguồn
        if (id === targetTableId) {
            enqueueSnackbar("Bàn đích không thể là bàn nguồn!", { variant: "warning" });
            return;
        }

        // ✅ Bước 2: Chọn/bỏ chọn bàn nguồn
        setSelectedTables((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((tid) => tid !== id)
                : [...prevSelected, id]
        );
    };



    const handleConfirmMerge = async () => {
        if (!targetTableId || selectedTables.length === 0) {
            enqueueSnackbar("Vui lòng chọn bàn đích và ít nhất 1 bàn nguồn để gộp!", {
                variant: "warning",
            });
            return;
        }

        // Kiểm tra lại lần cuối trạng thái các bàn
        const allTableIds = [...selectedTables, targetTableId];
        const allTables = tables.filter((table) => allTableIds.includes(table._id));

        const invalidTable = allTables.find((table) => table.status !== "Occupied");
        if (invalidTable) {
            enqueueSnackbar(
                `Bàn "${invalidTable.name}" không ở trạng thái Occupied và không thể gộp.`,
                { variant: "error" }
            );
            return;
        }

        const confirm = window.confirm(
            `Xác nhận gộp ${selectedTables.length} bàn vào bàn ${targetTableId}?`
        );
        if (!confirm) return;

        try {
            await api.mergeTables(allTableIds, targetTableId);
            enqueueSnackbar("Gộp bàn thành công!", { variant: "success" });
            queryClient.invalidateQueries(["tables"]);
            resetMerge();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || "Lỗi khi gộp bàn", {
                variant: "error",
            });
            console.error("Lỗi khi gộp bàn:", err);
        }
    };

    // 🔵 Xử lý khi ở chế độ chuyển bàn
    const getNowInVietnam = () =>
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

    const parseSlotDateTime = (slot) => {
        if (!slot?.date || !slot?.time) return null;
        try {
            const isoString = `${slot.date.split("T")[0]}T${slot.time}`;
            return new Date(new Date(isoString).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
        } catch {
            return null;
        }
    };

    const handleTransferTable = async (table) => {
        const now = getNowInVietnam();
        const id = table._id;

        // Bước 1: chọn bàn nguồn
        if (!sourceTableId) {
            if (table.status !== "Occupied") {
                enqueueSnackbar("Chỉ có thể chọn bàn đang phục vụ (Occupied) để chuyển!", { variant: "warning" });
                return;
            }

            setSourceTableId(id);
            enqueueSnackbar("Chọn bàn đích để chuyển khách sang", { variant: "info" });
            return;
        }

        // Bước 2: chọn bàn đích
        if (id === sourceTableId) {
            enqueueSnackbar("Không thể chọn cùng một bàn làm bàn đích!", { variant: "warning" });
            return;
        }

        // Không cho chuyển đến bàn đang có khách
        if (table.status === "Occupied") {
            enqueueSnackbar("Không thể chuyển sang bàn đang có khách!", { variant: "warning" });
            return;
        }

        // Kiểm tra reservation của bàn đích
        const reservations = table.reservations || [];
        const hasSoonReservation = reservations.some((res) => {
            const resTime = parseSlotDateTime(res);
            return resTime && (resTime.getTime() - now.getTime()) < 2 * 60 * 60 * 1000;
        });

        if (hasSoonReservation) {
            enqueueSnackbar("Không thể chuyển sang bàn có đặt trước trong vòng 2 tiếng!", { variant: "warning" });
            return;
        }

        const confirm = window.confirm(`Xác nhận chuyển khách từ bàn ${sourceTableId} sang bàn ${id}?`);
        if (confirm) {
            try {
                await api.switchTable(sourceTableId, id);
                enqueueSnackbar("Chuyển bàn thành công!", { variant: "success" });
                queryClient.invalidateQueries(["tables"]);
            } catch (err) {
                enqueueSnackbar(err.message || "Lỗi khi chuyển bàn", { variant: "error" });
                console.error("Lỗi chuyển bàn:", err);
            }
            resetTransfer();
        } else {
            resetTransfer();
        }
    };

    // ⚪ Xử lý khi không ở chế độ đặc biệt
    const handleNormalClick = async (table) => {
        const id = table._id;
        const status = table.status;
        const tableNo = table.tableNo
        const menuType = table.menuType

        if (status === "Available") {
            setSelectedTable(table);
            setAdults(1);
            setChildren(0);
            setMenuType("alacart");
            setOpenModal(true);
        } else if (status === "Occupied") {
            try {
                if (!table.currentOrder) {
                    enqueueSnackbar("Không tìm thấy đơn hàng!", { variant: "error" });
                    return;
                }

                const respone = await api.getOrderById(table.currentOrder._id);
                const tableInfor = respone.data
                dispatch(setCustomer({
                    name: tableInfor.customerDetails.name,
                    phone: tableInfor.customerDetails.phone,
                    guests: parseInt(tableInfor.customerDetails.guests),
                    table: tableNo,
                    orderId: tableInfor._id,
                    menuType: menuType
                }))
                navigate(`/menu?tableId=${id}`);
            } catch (error) {
                enqueueSnackbar("Lỗi tải thông tin đơn hàng", { variant: "error" });
                console.error(error);
            }
        } else if (status === "Reserved") {

        }
    };

    // ✅ Hàm tổng xử lý khi click bàn
    const handleClickTable = (table) => {
        if (isMergeMode) {
            handleMergeTable(table)
        } else if (isTransferMode) {
            handleTransferTable(table);
        } else {
            handleNormalClick(table);
        }
    };

    // Hàm sửa số chỗ ngồi bàn
    const handleEditTable = async (id, newSeats) => {
        try {
            await api.updateTable({ id, seats: newSeats });
            enqueueSnackbar("Cập nhật bàn thành công!", { variant: "success" });
            queryClient.invalidateQueries(["tables"]);
        } catch (error) {
            enqueueSnackbar("Cập nhật bàn thất bại!", { variant: "error" });
        }
    };

    // Hàm xóa bàn
    const handleDeleteTable = async (table) => {
        if (table.status !== "Available") {
            enqueueSnackbar("Chỉ có thể xoá bàn đang ở trạng thái 'Available'", { variant: "warning" });
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xoá bàn này?")) return;

        try {
            await api.deleteTable(table._id);
            enqueueSnackbar("Xoá bàn thành công!", { variant: "success" });
            queryClient.invalidateQueries(["tables"]);
        } catch (error) {
            enqueueSnackbar("Xoá bàn thất bại!", { variant: "error" });
        }
    };

    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
            {/* Top controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 md:px-10 py-4 gap-4">
                {/* Title + Back */}
                <div className="flex items-center gap-4">
                    <BackButton />
                    <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Bàn</h1>
                </div>

                {/* Mobile menu button */}
                <button
                    className="lg:hidden px-4 py-2 rounded-full bg-blue-600 text-white shadow-lg"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    aria-label="Toggle menu"
                >
                    ☰ Menu
                </button>

                {/* Filter buttons */}
                <div className="hidden lg:flex flex-wrap gap-2 justify-end">
                    <button
                        onClick={handleShowAll}
                        className={`text-[#ababab] text-sm md:text-lg ${!areaFilter && !statusFilter && "bg-[#383838]"
                            } rounded-lg px-4 py-2 font-semibold`}
                    >
                        Tất cả
                    </button>

                    {uniqueAreas.map((area) => (
                        <button
                            key={area._id}
                            onClick={() => handleAreaClick(area._id)}
                            className={`text-[#ababab] text-sm md:text-lg ${areaFilter === area._id && "bg-[#383838]"
                                } rounded-lg px-4 py-2 font-semibold`}
                        >
                            {area.area}
                        </button>
                    ))}

                    <button
                        onClick={() => handleStatusClick("Occupied")}
                        className={`text-[#ababab] text-sm md:text-lg ${statusFilter === "Occupied" && "bg-[#383838]"
                            } rounded-lg px-4 py-2 font-semibold`}
                    >
                        Đang hoạt động
                    </button>

                    <button
                        onClick={() => handleStatusClick("Reserved")}
                        className={`text-[#ababab] text-sm md:text-lg ${statusFilter === "Reserved" && "bg-[#383838]"
                            } rounded-lg px-4 py-2 font-semibold`}
                    >
                        Bàn đặt
                    </button>
                </div>
            </div>

            {/* Mobile menu popup */}
            {showMobileMenu && (
                <div className="lg:hidden bg-[#2a2a2a] p-4 space-y-3 rounded-md shadow-lg mx-4 mb-4">
                    <button
                        onClick={() => {
                            toggleEditMode();
                            setShowMobileMenu(false);
                        }}
                        className={`w-full px-4 py-2 rounded-full text-white ${isEditMode ? "bg-red-600" : "bg-blue-600"
                            }`}
                        disabled={isMergeMode || isTransferMode}
                    >
                        {isEditMode ? "Thoát quản lý" : "Quản lý bàn"}
                    </button>

                    <button
                        onClick={() => {
                            toggleMergeMode();
                            setShowMobileMenu(false);
                        }}
                        className={`w-full px-4 py-2 rounded-full text-white ${isMergeMode ? "bg-purple-600" : "bg-purple-400"
                            }`}
                        disabled={isEditMode || isTransferMode}
                    >
                        {isMergeMode ? "Huỷ gộp bàn" : "Gộp bàn"}
                    </button>

                    {targetTableId && selectedTables.length > 0 && (
                        <button
                            onClick={() => {
                                handleConfirmMerge();
                                setShowMobileMenu(false);
                            }}
                            className="w-full bg-green-600 text-white rounded-full px-5 py-2 font-semibold"
                        >
                            Xác nhận gộp bàn
                        </button>
                    )}

                    <button
                        onClick={() => {
                            toggleTransferMode();
                            setShowMobileMenu(false);
                        }}
                        className={`w-full px-4 py-2 rounded-full text-white ${isTransferMode ? "bg-orange-600" : "bg-orange-400"
                            }`}
                        disabled={isEditMode || isMergeMode}
                    >
                        {isTransferMode ? "Huỷ chuyển bàn" : "Chuyển bàn"}
                    </button>

                    <hr className="border-gray-600" />

                    <button
                        onClick={() => {
                            handleShowAll();
                            setShowMobileMenu(false);
                        }}
                        className={`w-full text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${!areaFilter && !statusFilter ? "bg-[#383838]" : ""
                            }`}
                    >
                        Tất cả
                    </button>

                    {uniqueAreas.map((area) => (
                        <button
                            key={area._id}
                            onClick={() => {
                                handleAreaClick(area._id);
                                setShowMobileMenu(false);
                            }}
                            className={`w-full text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${areaFilter === area._id ? "bg-[#383838]" : ""
                                }`}
                        >
                            {area.area}
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            handleStatusClick("Occupied");
                            setShowMobileMenu(false);
                        }}
                        className={`w-full text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${statusFilter === "Occupied" ? "bg-[#383838]" : ""
                            }`}
                    >
                        Đang hoạt động
                    </button>

                    <button
                        onClick={() => {
                            handleStatusClick("Reserved");
                            setShowMobileMenu(false);
                        }}
                        className={`w-full text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${statusFilter === "Reserved" ? "bg-[#383838]" : ""
                            }`}
                    >
                        Bàn đặt
                    </button>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {showMenuOptions && (
                    <div className="w-20 hover:w-56 transition-all duration-300 ease-in-out mt-5 p-4 pt-1 hidden md:flex flex-col justify-between text-white shadow-lg ml-10 h-full group">

                        {/* Nội dung menu */}
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={toggleEditMode}
                                className="flex items-center space-x-3 w-full bg-blue-500 px-4 py-2 rounded transition-all duration-300"
                            >
                                <span>🛠️</span>
                                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {isEditMode ? "Thoát quản lý" : "Quản lý bàn"}
                                </span>
                            </button>

                            <button
                                onClick={toggleMergeMode}
                                className="flex items-center space-x-3 w-full bg-purple-500 px-4 py-2 rounded transition-all duration-300"
                            >
                                <span>🔗</span>
                                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {isMergeMode ? "Huỷ gộp bàn" : "Gộp bàn"}
                                </span>
                            </button>

                            {targetTableId && selectedTables.length > 0 && (
                                <button
                                    onClick={handleConfirmMerge}
                                    className="flex items-center space-x-3 w-full bg-green-600 px-4 py-2 rounded transition-all duration-300"
                                >
                                    <span>✅</span>
                                    <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Xác nhận gộp bàn
                                    </span>
                                </button>
                            )}

                            <button
                                onClick={toggleTransferMode}
                                className="flex items-center space-x-3 w-full bg-orange-500 px-4 py-2 rounded transition-all duration-300"
                            >
                                <span>🔁</span>
                                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {isTransferMode ? "Huỷ chuyển bàn" : "Chuyển bàn"}
                                </span>
                            </button>
                        </div>

                        {/* Nút Đóng dưới cùng */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowMenuOptions(false)}
                                className="flex items-center space-x-3 w-full bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                            >
                                <span>✕</span>
                                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Đóng
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Khi menu bị ẩn, hiển thị nút mở menu ở góc trái */}
                {!showMenuOptions && (
                    <div className="w-14 hidden md:flex justify-center items-start pt-6 ml-10">
                        <button
                            onClick={() => setShowMenuOptions(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                            ☰
                        </button>
                    </div>
                )}

                {/* Cột bàn ăn */}
                <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-4 mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredTables?.map((table) => (
                            <TableCard
                                key={table._id}
                                id={table._id}
                                name={table.tableNo}
                                status={table.status}
                                seats={table.seats}
                                reservations={table.reservations}
                                isEditMode={isEditMode}
                                onEdit={handleEditTable}
                                onDelete={handleDeleteTable}
                                isSelectable={isMergeMode || isTransferMode}
                                isSelected={
                                    table._id === sourceTableId || selectedTables.includes(table._id)
                                }
                                onSelect={() => handleClickTable(table)}
                                onClick={() => handleClickTable(table)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <TableInfoModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                adults={adults}
                setAdults={setAdults}
                children={children}
                setChildren={setChildren}
                menuType={menuType}
                setMenuType={setMenuType}
                onConfirm={({ adults, children, menuType }) => {
                    setOpenModal(false);
                    if (!selectedTable) return;

                    dispatch(removeAllItems());
                    dispatch(
                        setCustomer({
                            name: "Hệ thống Pos",
                            phone: "0123456789",
                            guests: adults + children,
                            adults,
                            children,
                            menuType,
                            table: selectedTable.tableNo,
                        })
                    );

                    navigate(`/menu?tableId=${selectedTable._id}&menuType=${menuType}`);
                }}
            />

            <BottomNav />
        </section>

    );
};

export default Tables;
