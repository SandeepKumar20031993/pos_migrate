import { createSlice } from "@reduxjs/toolkit";
import {
  UPDATE_LOCATION_ID,
  UPDATE_LOCATION_NAME,
  SAVE_SUBS_DATA,
} from "../action";

const initialState = {
  data: {},
};

const storeDataSlice = createSlice({
  name: "storeData",
  initialState,
  reducers: {
    saveConfigData(state, action) {
      state.data = action.payload;
    },
    clearStoreData(state) {
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UPDATE_LOCATION_ID, (state, action) => {
      if (state.data?.data) {
        state.data.data.location_id = action.payload;
      }
    });
    builder.addCase(UPDATE_LOCATION_NAME, (state, action) => {
      if (state.data?.configs) {
        state.data.configs.location_name = action.payload;
      }
    });
    builder.addCase(SAVE_SUBS_DATA, (state, action) => {
      state.subs_data = action.payload;
    });
  },
});

export const { saveConfigData, clearStoreData } = storeDataSlice.actions;

export default storeDataSlice.reducer;
