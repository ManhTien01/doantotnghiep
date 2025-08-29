// ReservationTable.jsx
import React, { useEffect, useState } from "react";
import api from "../../https";
import EditModal from "./EditModal";
import TableSelectorModal from "./TableSelectorModal";
import { updateTableStatuses, parseSlotDateTime } from "../../utils/tableUtils";
import { MdEdit, MdDelete, MdTableRestaurant } from "react-icons/md";


const ReservationTable = () => {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuests, setSelectedGuests] = useState(0)

    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [availableTables, setAvailableTables] = useState([]);
    const [reservationToAssign, setReservationToAssign] = useState(null);

    // Fetch danh sách đặt bàn
    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await api.getReservations({ search, page, limit, date: filterDate });
            setReservations(res.reservations);
            setTotalPages(res.totalPages);
        } catch (err) {
            console.error("Error fetching reservations:", err);
        } finally {
            setLoading(false);
        }
    };


    // Xóa đặt bàn và cập nhật bàn liên quan
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá đặt bàn chứ?")) return;

        try {
            const reservation = reservations.find(r => r._id === id);
            if (!reservation) {
                alert("Không tìm thấy đặt bàn.");
                return;
            }

            await api.deleteReservation(id);

            if (reservation.tables && reservation.tables.length > 0) {
                for (const tableId of reservation.tables) {
                    const res = await api.getTableById(tableId);
                    const table = res?.data;

                    if (table) {
                        const updatedReservations = (table.reservations || []).filter(slot =>
                            !(slot.date === reservation.date && slot.time === reservation.time)
                        );

                        const newStatus = updatedReservations.length > 0 ? "Reserved" : "Available";

                        await api.updateTable({
                            id: table._id,
                            status: newStatus,
                            reservations: updatedReservations,
                        });
                    }
                }
            }

            await fetchReservations();
            await updateTableStatuses();
        } catch (err) {
            console.error("Error deleting reservation:", err);
            alert("Có lỗi xảy ra khi xoá đặt bàn.");
        }
    };


    // Cập nhật đặt bàn
    const handleUpdate = async (updatedData) => {
        try {
            const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
            const newDateTime = new Date(`${updatedData.date}T${updatedData.time}:00+07:00`);

            if (newDateTime <= now) {
                alert("Vui lòng chọn thời gian trong tương lai.");
                return;
            }

            await api.updateReservation(updatedData._id, updatedData);

            if (updatedData.tables && Array.isArray(updatedData.tables)) {
                const newSlot = { date: updatedData.date, time: updatedData.time };

                for (const tableId of updatedData.tables) {
                    const resTable = await api.getTableById(tableId);
                    const table = resTable?.data;

                    if (table) {
                        const existingSlots = table.reservations || [];
                        const isSlotExists = existingSlots.some(r => r.date === newSlot.date && r.time === newSlot.time);

                        if (!isSlotExists) {
                            await api.updateTable({
                                id: table._id,
                                status: "Reserved",
                                reservations: [...existingSlots, newSlot],
                            });
                        }
                    }
                }
            }

            setIsModalOpen(false);
            setSelectedReservation(null);
            await fetchReservations();
            await updateTableStatuses();
        } catch (err) {
            console.error("Error updating reservation:", err);
            alert("Lỗi khi cập nhật đặt bàn.");
        }
    };

    function canBookTableAtTime(existingSlots, newSlot) {
        const newSlotDate = parseSlotDateTime(newSlot);
        if (!newSlotDate) return false;

        return !existingSlots.some(slot => {
            const existingDate = parseSlotDateTime(slot);
            if (!existingDate) return false;

            const diffMs = Math.abs(existingDate - newSlotDate);
            const diffHours = diffMs / (1000 * 60 * 60);

            // Nếu khoảng cách nhỏ hơn 2 tiếng thì không cho đặt
            return diffHours < 2;
        });
    }

    // Xếp bàn cho đặt bàn
    const handleAssignTable = async (reservation) => {
        try {
            const res = await api.getTables();
            const tables = res?.data || [];

            const newSlot = { date: reservation.date, time: reservation.time };

            setSelectedGuests(reservation.people)

            const available = tables.filter(table => {
                // Nếu bàn chưa có đặt nào
                if (table.status === "Available") return true;

                if (table.status === "Reserved" && Array.isArray(table.reservations)) {
                    return canBookTableAtTime(table.reservations, newSlot);
                }

                return false;
            });

            if (available.length === 0) {
                alert("Không có bàn phù hợp hoặc thời gian đặt chưa đủ 2 tiếng kể từ lần đặt trước.");
                return;
            }

            setAvailableTables(available); // Danh sách bàn để chọn (multi-select UI)
            setReservationToAssign(reservation);
            setTableModalOpen(true);
        } catch (err) {
            console.error("Error assigning table:", err);
            alert("Có lỗi xảy ra khi xếp bàn.");
        }
    };

    // Chọn bàn trong modal xếp bàn
    const handleTableSelect = async (selectedTables) => {
        try {

            const { date, time, tables: oldTables = [] } = reservationToAssign;
            const totalSeats = selectedTables.reduce((sum, table) => sum + (table.seats || 0), 0);
    
            if (totalSeats < selectedGuests) {
                alert(`Số chỗ hiện tại (${totalSeats}) không đủ cho ${selectedGuests} khách. Vui lòng chọn thêm bàn.`);
                return;
            }
    
            // Gỡ slot khỏi các bàn cũ
            for (const old of oldTables) {
                const oldId = typeof old === "object" ? old._id : old;
                if (!oldId) continue;
    
                const resOld = await api.getTableById(oldId);
                const oldTable = resOld?.data;
                if (!oldTable) continue;
    
                const filteredReservations = (oldTable.reservations || []).filter(
                    r => !(r.date === date && r.time === time)
                );
    
                const newStatus = filteredReservations.length > 0 ? "Reserved" : "Available";
    
                await api.updateTable({
                    id: oldId,
                    status: newStatus,
                    reservations: filteredReservations,
                });
            }
    
            // Cập nhật reservation với các bàn mới
            await api.updateReservation(reservationToAssign._id, {
                ...reservationToAssign,
                tables: selectedTables.map(t => t._id),
            });
    
            // Gán slot đặt bàn cho từng bàn mới
            for (const table of selectedTables) {
                const resNew = await api.getTableById(table._id);
                const freshTable = resNew?.data;
                if (!freshTable) continue;
    
                const existingReservations = freshTable.reservations || [];
                const isSlotExists = existingReservations.some(
                    r => r.date === date && r.time === time
                );
    
                const updatedReservations = isSlotExists
                    ? existingReservations
                    : [...existingReservations, { date, time }];
    
                await api.updateTable({
                    id: table._id,
                    status: "Reserved",
                    reservations: updatedReservations,
                });
            }
    
            // Đóng modal và làm mới dữ liệu
            setTableModalOpen(false);
            setReservationToAssign(null);
            await fetchReservations();
            await updateTableStatuses();
        } catch (err) {
            console.error("Error saving selected tables:", err);
            alert("Lỗi khi lưu bàn.");
        }
    };
    

    // Mở modal chỉnh sửa đặt bàn
    const handleEditClick = (res) => {
        setSelectedReservation(res);
        setIsModalOpen(true);
    };

    // useEffect để fetch lại khi thay đổi search, page, filterDate
    useEffect(() => {
        fetchReservations();
    }, [search, page, filterDate]);

    // useEffect update trạng thái bàn khi component mount
    useEffect(() => {
        updateTableStatuses();
    }, []);



    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Đặt bàn</h2>
                <div className="flex gap-2 items-center">
                    <input
                        type="date"
                        className="border px-3 py-1 rounded-md bg-gray-900 text-white placeholder-gray-400"
                        value={filterDate}
                        onChange={(e) => {
                            setFilterDate(e.target.value);
                            setPage(1);
                        }}
                        style={{
                            WebkitAppearance: "textfield",
                        }}
                    />

                    <style>
                        {`
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: brightness(2) invert(1);
    cursor: pointer;
  }
`}
                    </style>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bằng tên, email, sđt,..."
                        className="border px-3 py-1 rounded-md w-64"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-md">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3">Tên</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Số điện thoại</th>
                            <th className="px-4 py-3">Ngày</th>
                            <th className="px-4 py-3">Giờ</th>
                            <th className="px-4 py-3">Số người</th>
                            <th className="px-4 py-3">Lời nhắn</th>
                            <th className="px-4 py-3">Bàn</th>
                            <th className="px-4 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : reservations.length > 0 ? (
                            reservations.map((res) => (
                                <tr key={res._id} className="border-t">
                                    <td className="px-4 py-2">{res.name}</td>
                                    <td className="px-4 py-2">{res.email}</td>
                                    <td className="px-4 py-2">{res.phone}</td>
                                    <td className="px-4 py-2">{new Date(res.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{res.time}</td>
                                    <td className="px-4 py-2">{res.people}</td>
                                    <td className="px-4 py-2">{res.message || "-"}</td>
                                    <td className="px-4 py-2">
                                        {Array.isArray(res.tables) && res.tables.length > 0
                                            ? res.tables.map((t) => t?.tableNo || "-").join(", ")
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-2 text-center space-x-2">
                                        <button
                                            title="Chỉnh sửa"
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => handleEditClick(res)}
                                        >
                                            <MdEdit size={20} />
                                        </button>
                                        <button
                                            title="Xếp bàn"
                                            className="text-green-600 hover:text-green-800"
                                            onClick={() => handleAssignTable(res)}
                                        >
                                            <MdTableRestaurant size={20} />
                                        </button>
                                        <button
                                            title="Xóa"
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDelete(res._id)}
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    Không có đặt bàn nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

            <div className="mt-4 flex justify-center items-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedReservation}
                onSave={handleUpdate}
            />

            <TableSelectorModal
                isOpen={tableModalOpen}
                tables={availableTables}
                onSelect={handleTableSelect}
                onClose={() => setTableModalOpen(false)}
                initialSelected={reservationToAssign?.tables || []}
            />
        </div>
    );
};

export default ReservationTable;
