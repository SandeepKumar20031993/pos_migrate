import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRegisterOpen: false,
  data: null,
  register_id: null,
  amounts: {
    totalCash: 0,
    totalCard: 0,
    totalUPI: 0,
  },
  opening_denoms: {},
  totalSales: {},
  isLoaded: false,
};

const cashRegisterSlice = createSlice({
  name: "cashRegister",
  initialState,
  reducers: {
    loadCashRegisterData(state, action) {
      const data = action.payload;

      if (data?.register_id) {
        return {
          ...initialState,
          data,
          isRegisterOpen: true,
          register_id: data?.register_id,
          opening_denoms: data?.opening_denoms,
          isLoaded: true,
        };
      }

      return {
        ...initialState,
        isLoaded: true,
      };
    },
    clearCashRegister() {
      return initialState;
    },
  },
});

export const { loadCashRegisterData, clearCashRegister } =
  cashRegisterSlice.actions;

export default cashRegisterSlice.reducer;
