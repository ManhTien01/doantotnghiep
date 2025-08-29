import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Mỗi phần tử là 1 lượt đặt món (turn)
  currentTurn: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTurn: (state, action) => {
      state.currentTurn = action.payload;
    },

    addItems: (state, action) => {
      const newTurnData = action.payload; // { turn, time, items }

      if (
        !newTurnData ||
        typeof newTurnData.turn !== "number" ||
        !Array.isArray(newTurnData.items) ||
        newTurnData.items.length === 0
      ) {
        return;
      }

      const { turn, time, items: newItems } = newTurnData;

      const existingTurn = state.items.find((t) => t.turn === turn);

      if (existingTurn) {
        // ✅ Nếu đã có lượt này → gộp thêm món vào lượt đó
        newItems.forEach((newItem) => {
          if (!newItem?.dish?._id) return;

          const existing = existingTurn.items.find(
            (item) => item.dish._id === newItem.dish._id
          );

          if (existing) {
            existing.quantity += newItem.quantity;
            existing.notes = newItem.notes || existing.notes;
            existing.status = newItem.status || existing.status;
          } else {
            existingTurn.items.push({
              ...newItem,
              status: newItem.status || "Đang chế biến",
              notes: newItem.notes || "",
            });
          }
        });
      } else {
        // ✅ Nếu turn mới chưa có trong danh sách → thêm lượt mới vào mảng
        state.items.push({
          turn,
          time: time || new Date().toISOString(),
          items: newItems.map((item) => ({
            ...item,
            status: item.status || "Đang chế biến",
            notes: item.notes || "",
          })),
        });
      }

      // ✅ Cập nhật lượt hiện tại
      state.currentTurn = turn;
      
    },

    updateItem: (state, action) => {
      const { turn, dishId, changes } = action.payload;
      const turnObj = state.items.find((t) => t.turn === turn);
      if (!turnObj) return;

      const item = turnObj.items.find((i) => i.dish._id === dishId);
      if (!item) return;

      Object.assign(item, changes);
    },

    removeItem: (state, action) => {
      const { turn, dishId } = action.payload;
      const turnObj = state.items.find((t) => t.turn === turn);
      if (!turnObj) return;

      turnObj.items = turnObj.items.filter((i) => i.dish._id !== dishId);
    },
    
    removeItemsByCurrentTurn: (state) => {
      const turnObj = state.items.find((t) => t.turn === state.currentTurn);
      if (!turnObj) return;
    
      turnObj.items = []; // Xóa toàn bộ món trong lượt hiện tại
    },
    
    removeAllItems: (state) => {
      state.items = [];
      state.currentTurn = 0;
    },

    setOrderItems: (state, action) => {
      const allTurns = action.payload; // [{ turn, time, items: [...] }]
      if (!Array.isArray(allTurns)) return;

      // Xử lý từng lượt
      const updatedTurns = allTurns.map(({ turn, time, items }) => {
        if (
          typeof turn !== "number" ||
          !Array.isArray(items) ||
          items.length === 0
        ) {
          return null; // Bỏ qua lượt không hợp lệ
        }

        return {
          turn,
          time: time || new Date().toISOString(),
          items: items.map((item) => ({
            ...item,
            status: item.status || "Đang chế biến",
            notes: item.notes || "",
          })),
        };
      }).filter(Boolean); // loại bỏ lượt null

      if (!updatedTurns.length) return;

      // Cập nhật state
      state.items = updatedTurns;

      // Tìm lượt cao nhất
      const maxTurn = Math.max(...updatedTurns.map((i) => i.turn));
      state.currentTurn = maxTurn;
    },


    createNewTurn: (state) => {
      const newTurn = state.items.length > 0
        ? Math.max(...state.items.map((i) => i.turn)) + 1
        : 0;

      state.items.push({
        turn: newTurn,
        time: new Date().toISOString(),
        items: [],
      });

      state.currentTurn = newTurn;
    },
  },
});


// ---------------------
// Selectors
// ---------------------

export const getItemsByTurn = (turn) => (state) => {
  const found = state.cart.items.find((t) => t.turn === turn);
  return found ? found.items : [];
};

export const getTotalPrice = (state) => {
  let total = 0;
  state.cart.items.forEach((turnObj) => {
    turnObj.items.forEach((item) => {
      if (!item?.dish || typeof item.dish.price !== "number") return;
      total += item.dish.price * item.quantity;
    });
  });
  return total;
};

export const getTotalTax = (state) => {
  let tax = 0;

  state.cart.items.forEach((turnObj) => {
    turnObj.items.forEach((item) => {
      const dish = item?.dish;
      if (!dish || typeof dish.price !== "number" || typeof dish.tax !== "number") return;

      const quantity = Number(item.quantity) || 0;
      const price = dish.price * quantity;
      const itemTax = (dish.tax / 100) * price;

      tax += itemTax;
    });
  });

  return Math.round(tax);
};


export const selectMergedItems = (state) => {
  const merged = [];
  state.cart.items.forEach((turnObj) => {
    turnObj.items.forEach((item) => {
      const existing = merged.find((i) => i.dish._id === item.dish._id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.push({ ...item });
      }
    });
  });
  return merged;
};

// ---------------------
// Exports
// ---------------------

export const {
  setTurn,
  addItems,
  updateItem,
  removeItem,
  removeItemsByCurrentTurn,
  removeAllItems,
  setOrderItems,
  createNewTurn,
} = cartSlice.actions;

export default cartSlice.reducer;
