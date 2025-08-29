// src/utils/tableLogic.js
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
  
  // ✅ Hàm lọc và lấy reservation còn hiệu lực (giống bên updateTableStatuses)
  export const getValidReservations = (reservations, now = new Date()) => {
    return reservations
      .map((res) => ({
        ...res,
        dateTime: parseSlotDateTime(res),
      }))
      .filter((res) => {
        if (!res.dateTime) return false;
        const endHold = new Date(res.dateTime.getTime() + 30 * 60 * 1000);
        return endHold > now;
      })
      .sort((a, b) => a.dateTime - b.dateTime);
  };
  
  // ✅ Tính toán trạng thái bàn dựa trên valid reservations
  export const deriveTableStatus = (originalStatus, reservations, now = new Date()) => {
    const today = getDateString(now);
    const valid = getValidReservations(reservations, now);
  
    if (valid.length === 0) return "Available";
  
    const first = valid[0];
    const isToday = getDateString(first.date) === today;
    return isToday ? "Reserved" : "Available";
  };
  