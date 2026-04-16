import { createSlice } from "@reduxjs/toolkit";

const initialPriceState = {
  product: { prices: [] },
  price: "",
  pricePopup: false,
  editProdPopup: false,
  editableProduct: "",
};

const initialQtyState = {
  qtyPopup: false,
  qtyProduct: {},
};

const initialState = {
  ...initialPriceState,
  ...initialQtyState,
};

const productConfigSlice = createSlice({
  name: "productConfig",
  initialState,
  reducers: {
    openPricePopup(state, action) {
      state.pricePopup = action.payload;
    },
    saveMultiPriceProduct(state, action) {
      state.product = action.payload;
    },
    saveSelectedPrice(state, action) {
      state.price = action.payload;
    },
    clearMultiPriceData(state) {
      state.product = initialPriceState.product;
      state.price = initialPriceState.price;
      state.pricePopup = initialPriceState.pricePopup;
      state.editProdPopup = initialPriceState.editProdPopup;
      state.editableProduct = initialPriceState.editableProduct;
    },
    openQtyPopup(state, action) {
      state.qtyPopup = action.payload;
    },
    saveQtyProduct(state, action) {
      state.qtyProduct = action.payload;
    },
    clearQtyData(state) {
      state.qtyPopup = initialQtyState.qtyPopup;
      state.qtyProduct = initialQtyState.qtyProduct;
    },
    toggleEditProductPopup(state, action) {
      state.editProdPopup = action.payload;
    },
    loadEditableProduct(state, action) {
      state.editableProduct = action.payload;
    },
  },
});

export const {
  openPricePopup,
  saveMultiPriceProduct,
  saveSelectedPrice,
  clearMultiPriceData,
  openQtyPopup,
  saveQtyProduct,
  clearQtyData,
  toggleEditProductPopup,
  loadEditableProduct,
} = productConfigSlice.actions;

export default productConfigSlice.reducer;
