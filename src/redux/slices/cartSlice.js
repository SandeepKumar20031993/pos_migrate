import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = {
        ...action.payload,
        cart_id: Date.now(),
      };

      item.pre_qty = item.qty;
      item.qty =
        item?.accept_weight && item?.add_qty ? Number(item?.add_qty) : 1;

      state.unshift(item);
    },
    addToCartWithQty(state, action) {
      state.unshift({
        ...action.payload,
        cart_id: Date.now(),
      });
    },
    updateQty(state, action) {
      const newProduct = action.payload;
      return state.map((product) => {
        if (
          product.barcode === newProduct.barcode &&
          product.price === newProduct.price
        ) {
          return {
            ...product,
            qty: Number(product.qty) + 1,
          };
        }
        return product;
      });
    },
    updateProductWithQty(state, action) {
      const newProduct = action.payload;
      return state.map((product) => {
        if (
          product.barcode === newProduct.barcode &&
          product.price === newProduct.price
        ) {
          return {
            ...product,
            qty: Number(product.qty) + Number(newProduct.qty),
          };
        }
        return product;
      });
    },
    updateCartPrice(state, action) {
      const newProduct = action.payload;
      return state.map((product) => {
        if (
          product.barcode === newProduct.barcode &&
          product.cart_id === newProduct.cart_id
        ) {
          return {
            ...product,
            ...newProduct,
          };
        }
        return product;
      });
    },
    changeQty(state, action) {
      const newProduct = action.payload;
      return state.map((product) => {
        if (
          product.barcode === newProduct.barcode &&
          product.price === newProduct.price
        ) {
          return {
            ...newProduct,
          };
        }
        return product;
      });
    },
    updateProduct(state, action) {
      const newProduct = action.payload;
      return state.map((product) => {
        if (product.id === newProduct.id) {
          return {
            ...product,
            qty: Number(newProduct.qty),
          };
        }
        return product;
      });
    },
    decreaseQty(state, action) {
      const newProduct = action.payload;
      return state.map((product) => {
        if (
          product.barcode === newProduct.barcode &&
          product.price === newProduct.price
        ) {
          if (product.qty > 1) {
            return {
              ...product,
              qty: Number(product.qty) - 1,
            };
          }
        }
        return product;
      });
    },
    removeCartItem(state, action) {
      state.splice(action.payload, 1);
    },
    clearCart() {
      return initialState;
    },
    restoreSuspendedCartProduct(state, action) {
      state.push(action.payload);
    },
  },
});

export const {
  addToCart,
  addToCartWithQty,
  updateQty,
  updateProductWithQty,
  updateCartPrice,
  changeQty,
  updateProduct,
  decreaseQty,
  removeCartItem,
  clearCart,
  restoreSuspendedCartProduct,
} = cartSlice.actions;

export default cartSlice.reducer;
