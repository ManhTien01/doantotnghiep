// src/utils/tableUtils.js
import api from "../https";

export const updateTableStatuses = async () => {
  try {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const today = now.toISOString().split("T")[0];

    const tablesRes = await api.getTables();
    const allTables = tablesRes?.data || [];

    for (const table of allTables) {
      if (table.status === "Occupied") continue;

      const reservations = table.reservations || [];
      const validSlots = [];
      let expiredFound = false;

      for (const slot of reservations) {
        const slotStart = parseSlotDateTime(slot);
        if (!slotStart) continue;

        const lateLimit = new Date(slotStart.getTime() + 30 * 60 * 1000);
        if (now > lateLimit) {
          expiredFound = true;
          continue;
        }
        validSlots.push(slot);
      }

      if (expiredFound) {
        const newStatus =
          validSlots.length === 0
            ? "Available"
            : getDateString(validSlots[0].date) === today
            ? "Reserved"
            : "Available";

        await api.updateTable({
          id: table._id,
          status: newStatus,
          reservations: validSlots,
        });
        continue;
      }

      if (validSlots.length === 0) {
        if (table.status !== "Available") {
          await api.updateTable({
            id: table._id,
            status: "Available",
            reservations: [],
          });
        }
        continue;
      }

      validSlots.sort((a, b) => parseSlotDateTime(a) - parseSlotDateTime(b));
      const nextSlot = validSlots[0];
      const newStatus = getDateString(nextSlot.date) === today ? "Reserved" : "Available";

      const isReservationsChanged =
        validSlots.length !== reservations.length ||
        validSlots.some((slot, idx) => slot.date !== reservations[idx]?.date || slot.time !== reservations[idx]?.time);

      if (newStatus !== table.status || isReservationsChanged) {
        await api.updateTable({
          id: table._id,
          status: newStatus,
          reservations: validSlots,
        });
      }
    }
  } catch (err) {
    console.error("Error updating table statuses:", err);
  }
};

// Bạn cũng cần export 2 hàm phụ trợ nếu dùng chung:
export const getDateString = (dateInput) => {
  if (!dateInput) return null;
  if (typeof dateInput === "string") {
    if (dateInput.includes("T")) return dateInput.split("T")[0];
    return dateInput;
  }
  if (dateInput instanceof Date) return dateInput.toISOString().split("T")[0];
  return null;
};

export const parseSlotDateTime = (slot) => {
  const dateStr = getDateString(slot.date)?.trim();
  const timeStr = slot.time?.trim();

  if (!dateStr || !timeStr) return null;

  let timeFormatted = timeStr;
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    timeFormatted = timeStr + ":00";
  }

  const dateTimeStr = `${dateStr}T${timeFormatted}+07:00`;
  const dateObj = new Date(dateTimeStr);

  if (isNaN(dateObj.getTime())) return null;
  return dateObj;
};
