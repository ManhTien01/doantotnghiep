// Updated CartInfo.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../https";
import {
  removeItem,
  setOrderItems,
  updateItem,
} from "../../redux/slices/cartSlice";
import Header from "./Header";
import Modal from "./Modal";
import CartList from "./CartList";

const CartInfo = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const tableId = new URLSearchParams(location.search).get("tableId");
  const cartItems = useSelector((state) => state.cart.items);
  const isSaved = useSelector((state) => state.order.isOrderSaved);

  const [orders, setOrders] = useState(null);
  const [isMerged, setIsMerged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showServed, setShowServed] = useState(true);
  const [showUnserved, setShowUnserved] = useState(true);
  const [editingNote, setEditingNote] = useState({ id: null, turn: null });
  const [tempNote, setTempNote] = useState("");
  const [isOrderSaved, setIsOrderSaved] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);


  const scrollRef = useRef();
  const firstRender = useRef(true);

  const { data } = useQuery({ queryKey: ["tables"], queryFn: () => api.getTables() });
  const currentTable = data?.data?.find((t) => t._id === tableId);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentTable?.status === "Occupied" && tableId) {
        const res = await api.getOrderByTableId(tableId);
        const orderData = res?.data;

        if (Array.isArray(orderData?.items)) {
          setOrders(orderData);
          dispatch(setOrderItems(orderData.items));

          // Giả sử orderData có trạng thái đơn hàng saved hay chưa (ví dụ orderData.isSaved)
          setIsOrderSaved(isSaved || false);

          // Lấy turn lớn nhất trong orderData.items
          const maxTurn = orderData.items.reduce(
            (max, item) => (item.turn > max ? item.turn : max),
            0
          );
          setCurrentTurn(maxTurn);
        } else {
          setOrders(null);
          dispatch(setOrderItems([]));
          setIsOrderSaved(false);
          setCurrentTurn(0);
        }
      }
    };
    fetchOrders();
  }, [currentTable, tableId, dispatch]);


  useEffect(() => {
    if (!firstRender.current) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    } else {
      firstRender.current = false;
    }
  }, [cartItems]);

  const mergedItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];

    const mergedMap = new Map();

    cartItems.forEach((turnObj) => {
      if (!Array.isArray(turnObj.items)) return;

      turnObj.items.forEach((item) => {
        const key = `${item.dish._id}-${item.notes || ""}`;
        const existing = mergedMap.get(key);

        if (existing) {
          existing.quantity += item.quantity;

          // Gộp ghi chú, tránh trùng
          const existingNotes = existing.notes ? existing.notes.split('; ') : [];
          const itemNotes = item.notes ? item.notes.split('; ') : [];
          const combinedNotes = [...new Set([...existingNotes, ...itemNotes])].join('; ');
          existing.notes = combinedNotes;
        } else {
          mergedMap.set(key, { ...item, turn: 0 });
        }
      });
    });

    return [{ turn: 0, items: Array.from(mergedMap.values()) }];
  }, [cartItems, showServed, showUnserved]);



  const handleToggleServed = (dishId, turn) => {
    if (!Array.isArray(cartItems)) return;

    const updatedCart = cartItems.map((turnObj) => {
      if (turnObj.turn !== turn) return turnObj;

      return {
        ...turnObj,
        items: turnObj.items.map((item) => {
          if (item.dish._id === dishId) {
            // Chỉ đổi trạng thái từ Đang chế biến hoặc Sẵn sàng phục vụ sang Đã phục vụ
            if (item.status === "Đang chế biến" || item.status === "Sẵn sàng phục vụ") {
              return { ...item, status: "Đã phục vụ" };
            }
            // Nếu đã là Đã phục vụ thì giữ nguyên không đổi
            return item;
          }
          return item;
        }),
      };
    });

    dispatch(setOrderItems(updatedCart));
  };


  // Toggle trạng thái phục vụ cho tất cả món trong 1 lượt (turn)
  const handleToggleAllInTurn = (turnNumber) => {
    if (!Array.isArray(cartItems)) return;

    const updatedCart = cartItems.map((turnObj) => {
      if (turnObj.turn !== turnNumber) return turnObj;

      return {
        ...turnObj,
        items: turnObj.items.map((item) => {
          if (item.status !== "Đã phục vụ") {
            // Chuyển các món chưa phục vụ sang Đã phục vụ
            return { ...item, status: "Đã phục vụ" };
          }
          // Giữ nguyên món đã phục vụ
          return item;
        }),
      };
    });

    dispatch(setOrderItems(updatedCart));
  };

  // Toggle trạng thái phục vụ cho tất cả món ở tất cả lượt
  const handleToggleAll = () => {
    if (!Array.isArray(cartItems)) return;

    // Kiểm tra xem còn món nào chưa phục vụ không
    const hasUnserved = cartItems.some((turnObj) =>
      turnObj.items.some((item) => item.status !== "Đã phục vụ")
    );

    const updatedCart = cartItems.map((turnObj) => ({
      ...turnObj,
      items: turnObj.items.map((item) => {
        if (hasUnserved && item.status !== "Đã phục vụ") {
          // Nếu còn món chưa phục vụ thì bật tất cả sang Đã phục vụ
          return { ...item, status: "Đã phục vụ" };
        }
        // Nếu tất cả đã phục vụ rồi, giữ nguyên trạng thái (không chuyển ngược)
        return item;
      }),
    }));

    dispatch(setOrderItems(updatedCart));
  };


  const handleNoteActions = {
    start: (id, turn, currentNote = "") => {
      if (isOrderSaved || turn < currentTurn) {
        alert("Bạn đã lưu hóa đơn, bếp đã nhận thông tin rồi");
        return;
      }
      setEditingNote({ id, turn });
      setTempNote(currentNote);
    },
    save: (dishId, turn) => {
      const newCart = [...cartItems];
      if (!newCart[turn]) return;

      newCart[turn] = {
        ...newCart[turn],
        items: newCart[turn].items.map((item) =>
          item.dish._id === dishId ? { ...item, notes: tempNote } : item
        ),
      };

      dispatch(setOrderItems(newCart));
      setEditingNote({ id: null, turn: null });
      setTempNote("");
    },
    cancel: () => {
      setEditingNote({ id: null, turn: null });
      setTempNote("");
    },
    keyDown: (e, dishId, turn) => {
      if (e.key === "Enter") handleNoteActions.save(dishId, turn);
      else if (e.key === "Escape") handleNoteActions.cancel();
    },
  };


  const handleRemove = (dishId, turn) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món này không?")) {
      dispatch(removeItem({ turn, dishId }));
    }
  };


  return (
    <div className="px-4 py-2">
      <Header {...{ isMerged, setIsMerged, setIsModalOpen }} />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cartItems={cartItems}
          showServed={showServed}
          showUnserved={showUnserved}
          toggleShowServed={() => setShowServed(!showServed)}
          toggleShowUnserved={() => setShowUnserved(!showUnserved)}
          handleToggleServedInModal={handleToggleServed}
          handleToggleAllInTurn={handleToggleAllInTurn}
          handleToggleAll={handleToggleAll}
        />
      )}
      <CartList
        isMerge={isMerged}
        cartItems={isMerged ? mergedItems : cartItems}
        scrollRef={scrollRef}
        editingNote={editingNote}
        tempNote={tempNote}
        setTempNote={setTempNote}
        handleNoteActions={handleNoteActions}
        handleRemove={handleRemove}
      />
    </div>
  );
};

export default CartInfo;