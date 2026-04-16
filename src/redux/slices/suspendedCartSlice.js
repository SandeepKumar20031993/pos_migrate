import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const suspendedCartSlice = createSlice({
  name: "suspendedCart",
  initialState,
  reducers: {
    suspendCart(state, action) {
      state.push(action.payload);
    },
    removeFromSuspended(state, action) {
      state.splice(action.payload, 1);
    },
    clearSuspendedCart() {
      return initialState;
    },
  },
});

export const { suspendCart, removeFromSuspended, clearSuspendedCart } =
  suspendedCartSlice.actions;

export default suspendedCartSlice.reducer;
