import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerName: "",
  customerPhone: "",
  guests: 0,
  adults: 0,
  children: 0,
  table: null,
  orderId: null,
  menuType: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests, table, orderId, adults, children, menuType } = action.payload;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
      state.table = table
      state.orderId = orderId
      state.adults = adults
      state.children = children
      state.menuType = menuType
    },

    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
      state.orderId = null;
      state.adults = 0
      state.children = 0
      state.menuType = null
    },

    updateTable: (state, action) => {
      state.table = action.payload;
    },

    // Optional: cập nhật số khách
    updateGuests: (state, action) => {
      state.guests = action.payload;
    }
  }
});

export const { setCustomer, removeCustomer, updateTable, updateGuests } = customerSlice.actions;
export default customerSlice.reducer;
