import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice"
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import tableSlice from "./slices/tableSlice"
import orderSlice from "./slices/orderSlice"

const store = configureStore({
    reducer: {
        table: tableSlice,
        customer: customerSlice,
        cart : cartSlice,
        user : userSlice,
        order: orderSlice
    },

    devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;