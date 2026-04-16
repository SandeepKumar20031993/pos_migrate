import { createSlice } from "@reduxjs/toolkit";

const isLoggedSlice = createSlice({
  name: "isLogged",
  initialState: false,
  reducers: {
    isLoogedIn(state, action) {
      return action.payload;
    },
  },
});

export const { isLoogedIn } = isLoggedSlice.actions;

export default isLoggedSlice.reducer;
