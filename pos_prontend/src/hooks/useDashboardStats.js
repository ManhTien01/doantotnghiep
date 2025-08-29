import { useQuery } from "@tanstack/react-query";
import api from "../https";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Kích hoạt các plugin của dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// Cấu hình múi giờ Việt Nam
const VN_TZ = "Asia/Ho_Chi_Minh";

// Hàm so sánh 2 ngày theo ngày địa phương VN
const isSameDay = (date1, date2) => {
    return (
        dayjs(date1).tz(VN_TZ).format("YYYY-MM-DD") ===
        dayjs(date2).tz(VN_TZ).format("YYYY-MM-DD")
    );
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const res = await api.getOrders();
            const orders = res?.data ?? [];
            const today = dayjs().tz(VN_TZ);
            const yesterday = today.subtract(1, "day");

            const todayOrders = orders.filter((order) =>
                order.orderStatus === "Paid" && isSameDay(order.orderDate, today)

            );

            const yesterdayOrders = orders.filter((order) =>
                order.orderStatus === "Paid" && isSameDay(order.orderDate, yesterday)
            );
           
            const todayRevenue = todayOrders.reduce(
                (sum, order) => sum + (Number(order?.bills?.totalWithTax) || 0),
                0
            );

            const yesterdayRevenue = yesterdayOrders.reduce(
                (sum, order) => sum + (Number(order?.bills?.totalWithTax) || 0),
                0
            );

            const todayCount = todayOrders.length;
            const yesterdayCount = yesterdayOrders.length;

            const revenueChange =
                yesterdayRevenue > 0
                    ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(2)
                    : "100";

            const orderCountChange =
                yesterdayCount > 0
                    ? (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(2)
                    : "100";

            return {
                todayRevenue,
                todayCount,
                footnum: {
                    revenue: revenueChange,
                    orderCount: orderCountChange,
                },
            };
        },
        retry: false,
        onError: (error) => {
            console.error("Error fetching dashboard stats:", error);
        },
    });
};
