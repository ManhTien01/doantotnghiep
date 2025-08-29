import React, { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Invoice = ({ orderInfo, setShowInvoice, isFinal = false, paymentMethod = "" }) => {
  const printRef = useRef();
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    if (isFinal) {
      navigate("/tables");
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Hóa đơn</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              color: #333;
            }
            h2 {
              text-align: center;
              font-size: 20px;
              margin-bottom: 10px;
            }
            .info p {
              margin: 4px 0;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
              font-size: 14px;
            }
            th {
              background-color: #f8f8f8;
              font-weight: bold;
            }
            .summary {
              margin-top: 12px;
              font-size: 14px;
            }
            .summary div {
              display: flex;
              justify-content: space-between;
              margin: 4px 0;
            }
            .summary .total {
              font-weight: bold;
              font-size: 16px;
              border-top: 1px dashed #999;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  // Gộp các món giống nhau theo dish._id
  const mergedItems = useMemo(() => {
    if (!Array.isArray(orderInfo.items)) return [];

    const mergedMap = new Map();

    orderInfo.items.forEach((turnObj) => {
      if (!Array.isArray(turnObj.items)) return;

      turnObj.items.forEach((item) => {
        const dishId = item.dish?._id || item._id;
        const existing = mergedMap.get(dishId);

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          mergedMap.set(dishId, { ...item });
        }
      });
    });

    return Array.from(mergedMap.values());
  }, [orderInfo.items]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
        <div ref={printRef}>
          <h2 className="text-2xl font-bold text-center mb-4">
            {isFinal ? "HÓA ĐƠN THANH TOÁN" : "HÓA ĐƠN TẠM TÍNH"}
          </h2>

          <div className="info text-sm text-gray-700 space-y-1 mb-3">
            <p><strong>Khách hàng:</strong> {orderInfo.customerDetails?.name || "N/A"}</p>
            <p><strong>SĐT:</strong> {orderInfo.customerDetails?.phone || "N/A"}</p>
            <p><strong>Số khách:</strong> {orderInfo.customerDetails?.guests || "N/A"}</p>
            {isFinal && (
              <>
                <p><strong>Ngày thanh toán:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Phương thức:</strong> {paymentMethod}</p>
              </>
            )}
          </div>

          <table className="w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-1">Tên món</th>
                <th className="border border-gray-300 px-2 py-1">Số lượng</th>
                <th className="border border-gray-300 px-2 py-1">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {mergedItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1">{item.dish?.name || item.name}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {formatCurrency((item.dish?.price || item.price) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary text-sm mt-4 text-gray-800 space-y-1">
            <div className="flex justify-between pb-1">
              <span className="font-medium">Tạm tính:</span>
              <span>{formatCurrency(orderInfo?.bills?.total)}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-medium">Thuế:</span>
              <span>{formatCurrency(orderInfo?.bills?.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-black mt-2 pt-2 border-t border-gray-400">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(orderInfo?.bills?.totalWithTax)}</span>
            </div>
          </div>

        </div>

        {/* Nút thao tác */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-yellow-400 hover:bg-yellow-300 w-full py-2 rounded-lg text-black font-semibold transition"
          >
            In hóa đơn
          </button>
          <button
            onClick={handleCloseInvoice}
            className="bg-gray-300 hover:bg-gray-200 w-full py-2 rounded-lg font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
