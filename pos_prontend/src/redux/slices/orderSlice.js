// src/redux/slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: {
    name: "",
    phone: "",
    guests: 0,
    orderId: null,
  },
  items: [], // Danh sách món ăn trong đơn
  isOrderSaved: false,  // trạng thái đã lưu hóa đơn chưa
  currentTurn: 0,       // lượt hiện tại (turn)
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setOrderItems: (state, action) => {
      state.items = action.payload;
    },
    clearOrder: (state) => {
      state.customer = { name: "", phone: "", guests: 0, orderId: null };
      state.items = [];
      state.isOrderSaved = false;
      state.currentTurn = 0;
    },

    // Thêm action setIsOrderSaved
    setIsOrderSaved: (state, action) => {
      state.isOrderSaved = action.payload;
    },

    // Thêm action setCurrentTurn
    setCurrentTurn: (state, action) => {
      state.currentTurn = action.payload;
    },
  },
});

export const {
  setCustomer,
  setOrderItems,
  clearOrder,
  setIsOrderSaved,
  setCurrentTurn,
} = orderSlice.actions;

export default orderSlice.reducer;
