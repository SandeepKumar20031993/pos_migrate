import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UrlHelper from "../../Helper/urlHelper";
import { post } from "../action/http";

const initialState = {
  open: false,
  apply: false,
  coupon: "",
  flatoff: "",
  percentoff: "",
  couponData: {},
  creditData: {},
  spotApply: false,
  is_credit_note: false,
  invoice: "",
};

const clearState = {
  apply: false,
  coupon: "",
  flatoff: "",
  percentoff: "",
  couponData: {},
  creditData: {},
  spotApply: false,
  is_credit_note: false,
  invoice: "",
};

export const fetchCoupon = createAsyncThunk(
  "discount/fetchCoupon",
  async (formData) => {
    const url = UrlHelper.REACT_APP_APPLY_CUSTOMER_COUPON();
    return post(url, formData);
  }
);

export const fetchCreditNoteCoupon = createAsyncThunk(
  "discount/fetchCreditNoteCoupon",
  async (formData) => {
    const url = UrlHelper.REACT_APP_CREDIT_NOTE_APPLY();
    return post(url, formData);
  }
);

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    openDiscountBox(state, action) {
      state.open = action.payload;
    },
    isDiscountCouponApplied(state, action) {
      state.apply = action.payload;
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
    },
    saveCouponData(state, action) {
      state.couponData = action.payload;
    },
    saveCreditData(state, action) {
      state.creditData = action.payload;
    },
    applyFlatoff(state, action) {
      state.flatoff = action.payload;
    },
    applyPercentoff(state, action) {
      state.percentoff = action.payload;
    },
    clearAppliedDiscount(state) {
      Object.assign(state, clearState);
    },
    spotApplyDiscount(state, action) {
      state.spotApply = action.payload;
    },
    isCreditNoteCoupon(state, action) {
      state.is_credit_note = action.payload;
    },
    updateInvoice(state, action) {
      state.invoice = action.payload;
    },
  },
});

export const {
  openDiscountBox,
  isDiscountCouponApplied,
  applyCoupon,
  saveCouponData,
  saveCreditData,
  applyFlatoff,
  applyPercentoff,
  clearAppliedDiscount,
  spotApplyDiscount,
  isCreditNoteCoupon,
  updateInvoice,
} = discountSlice.actions;

export default discountSlice.reducer;
