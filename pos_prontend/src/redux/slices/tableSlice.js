import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tables: [], // danh sách bàn
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.tables = action.payload;
    },
    addTable: (state, action) => {
      state.tables.push(action.payload);
    },
    updateTable: (state, action) => {
      const index = state.tables.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tables[index] = action.payload;
      }
    },
    removeTable: (state, action) => {
      state.tables = state.tables.filter(t => t._id !== action.payload);
    },
  },
});

export const { setTables, addTable, updateTable, removeTable } = tableSlice.actions;
export default tableSlice.reducer;
