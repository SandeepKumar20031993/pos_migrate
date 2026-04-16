import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const salesRecordSlice = createSlice({
  name: "salesRecord",
  initialState,
  reducers: {
    setSalesRecord(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearSalesRecord() {
      return initialState;
    },
  },
});

export const { setSalesRecord, clearSalesRecord } = salesRecordSlice.actions;

export default salesRecordSlice.reducer;
