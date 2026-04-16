import loggedReducer from "../slices/isLoggedSlice";
import themeReducer from "./themeReducer";
import InterActionReducer from "./InterActionReducer";
//import postReducer from './postReducer';
import storeCounterReducer from "./storeCounterReducer";
import logInNowReducer from "../slices/storeDataSlice";
import productsReducer from "./products";
import cartReducer from "../slices/cartSlice";
import checkoutReducer from "../slices/checkoutSlice";
import suspendedCartReducer from "../slices/suspendedCartSlice";
import returnReducer from "./returnReducer";
import discountReducer from "../slices/discountSlice";
import editReducer from "./editReducer";
import openCloseRegisterReducer from "./openCloseRegisterReducer";
import salesRecordReducer from "../slices/salesRecordSlice";
import cancelReducer from "./cancelReducer";
import offlineReducer from "../slices/offlineSlice";
import customerReducer from "./customerReducer";
import productConfig from "../slices/productConfigSlice";
import creditReducer from "./creditReducer";
import { combineReducers } from "redux";
import deliverReducer from "./deliverReducer";
import miscellaneousReducer from "./miscellaneousReducer";
import paymentsReducer from "./paymentsReducer";
import queueCartReducer from "./queueCartReducer";
import appointmentReducer from "./appointmentReducer";
import cashRegisterReducer from "../slices/cashRegisterSlice";
import exchangeReducer from "./exchangeReducer";

const allReducers = combineReducers({
  isLogged: loggedReducer,
  theme: themeReducer,
  interAction: InterActionReducer,
  //posts: postReducer,
  storeCounter: storeCounterReducer,
  storeData: logInNowReducer,
  productData: productsReducer,
  cartProduct: cartReducer,
  checkoutData: checkoutReducer,
  suspendedCart: suspendedCartReducer,
  returnData: returnReducer,
  discount: discountReducer,
  editData: editReducer,
  openCloseTill: openCloseRegisterReducer,
  salesRecord: salesRecordReducer,
  cancelData: cancelReducer,
  offlineData: offlineReducer,
  customerData: customerReducer,
  credit: creditReducer,
  productConfig: productConfig,
  delivery: deliverReducer,
  miscellaneous: miscellaneousReducer,
  payments: paymentsReducer,
  queueCart: queueCartReducer,
  appointments: appointmentReducer,
  cashRegister: cashRegisterReducer,
  exchange: exchangeReducer
});

const rootReducer = (state, action) => {
  // when a RESET_ALL_DATA action is dispatched it will reset redux state
  if (action.type === "RESET_ALL_DATA") {
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;
//export default allReducers;
