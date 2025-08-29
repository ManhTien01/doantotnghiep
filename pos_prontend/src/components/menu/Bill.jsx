import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTotalPrice,
  getTotalTax,
  removeAllItems,
  setOrderItems,
} from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../https/index";
import Invoice from "../invoice/Invoice";
import { setCurrentTurn, setIsOrderSaved } from "../../redux/slices/orderSlice";

const Bill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const cartItems = useSelector(state => state.cart.items);
  const customerName = useSelector(state => state.customer.customerName);
  const customerPhone = useSelector(state => state.customer.customerPhone);
  const guests = useSelector(state => state.customer.guests);
  const menuType =  useSelector(state => state.customer.menuType);
  const savedOrder = useSelector(state => state.order.isOrderSaved);
  const total = useSelector(getTotalPrice);
  const tax = useSelector(getTotalTax);
  const totalWithTax = total + tax;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTableId = searchParams.get("tableId");

  const [isFinalInvoice, setIsFinalInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);

  const { data: tableData } = useQuery({
    queryKey: ["tables"],
    queryFn: () => api.getTables(),
  });

  const tables = tableData?.data || [];
  const currentTable = tables.find((t) => t._id === currentTableId);

  // Tải đơn cũ nếu đã tồn tại
  useEffect(() => {
    const fetchOrder = async () => {
      if (currentTable?.status === "Occupied" && currentTable?.currentOrder) {
        try {
          const res = await api.getOrderById(currentTable.currentOrder._id);
          dispatch(setOrderItems(res.data.items || []));
          dispatch(setIsOrderSaved(true))
        } catch (err) {
          enqueueSnackbar("Lỗi khi lấy đơn bàn!", { variant: "error" });
        }
      }
    };
    if (currentTableId && currentTable) fetchOrder();
  }, [currentTableId, currentTable, dispatch, enqueueSnackbar]);

  // ✅ Theo dõi thay đổi cartItems để phát hiện lượt mới
  useEffect(() => {
    if (!currentTable?.currentTurn && currentTable?.currentTurn !== 0) return;
    const hasNewTurn = cartItems.some(item => item.turn > currentTable.currentTurn);
    if (hasNewTurn) dispatch(setIsOrderSaved(false));
  }, [cartItems, currentTable]);

  const addOrderMutation = useMutation({
    mutationFn: (orderPayload) => api.addOrder(orderPayload),
    onError: () =>
      enqueueSnackbar("Lưu hóa đơn thất bại (tạo mới)!", { variant: "error" }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ updateOrderId, orderPayload }) =>
      api.updateOrder({ updateOrderId, orderPayload }),
    onError: () =>
      enqueueSnackbar("Lưu hóa đơn thất bại (cập nhật)!", {
        variant: "error",
      }),
  });

  const updateTableMutation = useMutation({
    mutationFn: ({ id, tableData }) => api.updateTable({ id, ...tableData }),
    onError: () =>
      enqueueSnackbar("Cập nhật bàn thất bại!", { variant: "error" }),
  });

  const buildOrderPayload = (status, method = null) => ({
    customerDetails: {
      name: customerName,
      phone: customerPhone,
      guests,
    },
    orderStatus: status,
    bills: { total, tax, totalWithTax },
    items: cartItems,
    table: currentTableId,
    paymentMethod: method,
    paymentData: {},
  });

  const handleOpenPrintPayment = () => {
    setShowInvoice(true)
    setOrderInfo(buildOrderPayload("Unpaid"))
  }


  const handleSaveOrder = async () => {
    if (!cartItems.length) {
      return enqueueSnackbar("Không có món để lưu!", { variant: "warning" });
    }

    if (!customerName || !customerPhone || !guests) {
      return enqueueSnackbar("Thiếu thông tin khách hàng!", { variant: "warning" });
    }

    try {
      const currentTurn = currentTable?.currentTurn ?? -1;
      const newTurn = currentTurn + 1;

      const newTurnItems = cartItems.find(t => t.turn === newTurn);
      if (!newTurnItems || !newTurnItems.items.length) {
        return enqueueSnackbar("Không có món để lưu trong lượt mới!", { variant: "warning" });
      }

      const now = new Date().toISOString();
      const fullTurnItems = cartItems.map((turnObj) => ({
        turn: turnObj.turn,
        time: turnObj.time || now,
        items: turnObj.items.map((item) => ({
          ...item,
          status: item.status || "Đang chế biến",
          notes: item.notes || "",
        })),
      }));

      const orderPayload = buildOrderPayload("Unpaid");
      orderPayload.items = fullTurnItems;

      if (!currentTable?.currentOrder) {
        const res = await addOrderMutation.mutateAsync(orderPayload);
        const newOrder = res.data;

        setOrderInfo(newOrder);
        await updateTableMutation.mutateAsync({
          id: currentTableId,
          tableData: {
            tableNo: currentTable.tableNo,
            seats: currentTable.seats,
            area: currentTable.area._id,
            currentOrder: newOrder._id,
            status: "Occupied",
            currentTurn: newTurn,
            menuType: menuType
          },
        });

        enqueueSnackbar("Đã lưu hóa đơn mới!", { variant: "success" });
      } else {
        await updateOrderMutation.mutateAsync({
          updateOrderId: currentTable.currentOrder._id,
          orderPayload,
        });

        await updateTableMutation.mutateAsync({
          id: currentTableId,
          tableData: { currentTurn: newTurn },
        });

        enqueueSnackbar("Đã cập nhật hóa đơn!", { variant: "success" });
      }

      dispatch(setOrderItems(fullTurnItems));
      dispatch(setIsOrderSaved(true));
      // dispatch(setCurrentTurn(newTurn))
      await queryClient.invalidateQueries(["tables"]);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Lưu hóa đơn thất bại!", { variant: "error" });
    }
  };

  const handlePlaceOrder = async () => {
    setShowConfirmPayment(false);
    if (!paymentMethod) {
      return enqueueSnackbar("Vui lòng chọn phương thức thanh toán!", {
        variant: "warning",
      });
    }

    const orderPayload = buildOrderPayload("Paid", paymentMethod);
    const updateOrderId = currentTable?.currentOrder?._id;

    try {
      const res = await updateOrderMutation.mutateAsync({
        updateOrderId,
        orderPayload,
      });

      await updateTableMutation.mutateAsync({
        id: currentTableId,
        tableData: {
          tableNo: currentTable.tableNo,
          seats: currentTable.seats,
          area: currentTable.area._id,
          currentOrder: null,
          status: "Available",
          currentTurn: null,
          menuType: null,
        },
      });


      setOrderInfo(res.data);
      setShowInvoice(true);
      dispatch(removeAllItems());
      dispatch(removeCustomer());
      setIsFinalInvoice(true); // Gán trạng thái đã thanh toán
      dispatch(setIsOrderSaved(false));
      setPaymentMethod("");
      await queryClient.invalidateQueries(["tables"]);
      enqueueSnackbar("Thanh toán thành công!", { variant: "success" });
    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      enqueueSnackbar("Thanh toán thất bại!", { variant: "error" });
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmCancel(false);
    dispatch(removeAllItems());
    dispatch(removeCustomer());
    enqueueSnackbar("Đã hủy đơn!", { variant: "info" });
    navigate("/tables");
  };

  return (
    <>
      {/* Tổng */}
      <div className="px-5 mt-2 space-y-2">
        <div className="flex justify-between text-xs text-[#ababab] font-medium">
          <span>Mặt hàng ({cartItems.length})</span>
          <span className="text-[#f5f5f5] font-bold text-md">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <div className="flex justify-between text-xs text-[#ababab] font-medium">
          <span>Thuế</span>
          <span className="text-[#f5f5f5] font-bold text-md">
            {tax.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <div className="flex justify-between text-xs text-[#ababab] font-medium">
          <span>Tổng cộng</span>
          <span className="text-[#f5f5f5] font-bold text-md">
            {totalWithTax.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>

      {/* Nút chức năng */}
      {!savedOrder ? (
        <div className="flex gap-3 px-5 mt-4">
          <button
            onClick={() => setShowConfirmCancel(true)}
            className="bg-[#ff4d4d] w-full py-2 rounded-lg text-white font-semibold"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveOrder}
            className="bg-[#f6b100] w-full py-2 rounded-lg text-[#1f1f1f] font-semibold"
          >
            Lưu hóa đơn
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-3 px-5 mt-4">
            <button
              onClick={() => setPaymentMethod("Cash")}
              className={`w-full py-2 rounded-lg font-semibold ${paymentMethod === "Cash"
                ? "bg-[#383737] text-white"
                : "bg-[#1f1f1f] text-[#ababab]"
                }`}
            >
              Tiền mặt
            </button>
            <button
              onClick={() => setPaymentMethod("Online")}
              className={`w-full py-2 rounded-lg font-semibold ${paymentMethod === "Online"
                ? "bg-[#383737] text-white"
                : "bg-[#1f1f1f] text-[#ababab]"
                }`}
            >
              Online
            </button>
          </div>

          <div className="flex gap-3 px-5 mt-4">
            <button
              onClick={handleOpenPrintPayment}
              className="bg-[#f6b100] w-full py-2 rounded-lg text-[#1f1f1f] font-semibold"
            >
              In hoá đơn
            </button>
            <button
              onClick={() => setShowConfirmPayment(true)}
              className="bg-[#f6b100] w-full py-2 rounded-lg text-[#1f1f1f] font-semibold"
            >
              Thanh toán
            </button>
          </div>
        </>
      )}

      {/* Modal xác nhận */}
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg space-y-4 text-center">
            <h3 className="font-semibold text-lg">Bạn có chắc muốn hủy đơn?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelOrder}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Có
              </button>
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg space-y-4 text-center">
            <h3 className="font-semibold text-lg">
              Xác nhận thanh toán đơn hàng?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlaceOrder}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowConfirmPayment(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvoice && (
        <Invoice orderInfo={orderInfo}
          setShowInvoice={setShowInvoice}
          isFinal={isFinalInvoice}
          paymentMethod={paymentMethod}
        />
      )}
    </>
  );
};

export default Bill;
