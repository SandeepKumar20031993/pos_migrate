import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  hold: false,
};

const offlineSlice = createSlice({
  name: "offline",
  initialState,
  reducers: {
    saveOfflineOrder(state, action) {
      state.orders.push(action.payload);
    },
    removeOfflineOrder(state, action) {
      state.orders.splice(action.payload, 1);
    },
    removeAllOfflineOrder() {
      return initialState;
    },
    holdSyncing(state, action) {
      state.hold = action.payload;
    },
  },
});

export const {
  saveOfflineOrder,
  removeOfflineOrder,
  removeAllOfflineOrder,
  holdSyncing,
} = offlineSlice.actions;

export default offlineSlice.reducer;
