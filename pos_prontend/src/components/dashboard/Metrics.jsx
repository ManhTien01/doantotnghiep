import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../../https";

const Metrics = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [monthlyData, setMonthlyData] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    daily: [],
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.getMetricsByMonth({ month: selectedMonth});
        setMonthlyData(res);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu metrics:", err);
      }
    };
    fetchMetrics();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const { totalRevenue, totalCustomers, daily } = monthlyData;

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Hiệu suất tháng</h2>
          <p className="text-sm text-[#ababab]">
            Dữ liệu tổng hợp {selectedMonth}
          </p>
        </div>
        <select
          className="px-4 py-2 rounded bg-[#1a1a1a] text-white"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const m = String(i + 1).padStart(2, "0");
            return (
              <option key={m} value={`${new Date().getFullYear()}-${m}`}>
                {`${m}/${new Date().getFullYear()}`}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="shadow-sm rounded-lg p-4 bg-green-600 text-white">
          <p className="text-xs">Tổng doanh thu</p>
          <p className="mt-1 font-semibold text-xl">
            {totalRevenue.toLocaleString()} đ
          </p>
        </div>
        <div className="shadow-sm rounded-lg p-4 bg-blue-600 text-white">
          <p className="text-xs">Tổng số khách</p>
          <p className="mt-1 font-semibold text-xl">{totalCustomers}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-semibold text-[#f5f5f5] text-xl">Doanh thu và khách theo ngày</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily}>
            <CartesianGrid stroke="#444" strokeDasharray="5 5" />
            <XAxis dataKey="date" stroke="#eee" />
            <YAxis yAxisId="left" orientation="left" stroke="#0f0" />
            <YAxis yAxisId="right" orientation="right" stroke="#0ff" />
            <Tooltip contentStyle={{ background: "#333", borderColor: "#555" }} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0f0" name="Doanh thu" />
            <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#0ff" name="Khách" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Metrics;
