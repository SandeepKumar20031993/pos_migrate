import { createSlice } from "@reduxjs/toolkit";

const initialCustomerState = {
  customer_id: "",
  phone_number: "",
  customer_name: "",
  additional_comment: "",
  salesExec: "",
  countrycode: "",
  referralsource: "",
};

const initialOtherPaymentState = {
  cash: "",
  upi: "",
  card: "",
  cardNo: "",
  other: "",
  otherType: "OTHER",
};

const initialState = {
  data: {},
  responseData: {},
  billingData: {},
  tender: "",
  suspendedCart: [],
  customer: initialCustomerState,
  otherPayment: initialOtherPaymentState,
  dummyBill: false,
  token: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    prepareCheckout(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.responseData = {};
      state.billingData = {};
      state.tender = "";
      state.otherPayment = { ...initialOtherPaymentState };
      state.dummyBill = false;
    },
    updatePaymentMode(state, action) {
      state.data.payment_type = action.payload;
    },
    updateCardNo(state, action) {
      state.data.card_no = action.payload;
    },
    updatePaidAmt(state, action) {
      state.data.paid_amt = action.payload;
    },
    updateCreditAmt(state, action) {
      state.data.credit_amt = action.payload;
    },
    updateCustId(state, action) {
      state.customer.customer_id = action.payload;
    },
    updateCPhone(state, action) {
      state.customer.phone_number = action.payload;
    },
    updateCPhoneCode(state, action) {
      state.customer.countrycode = action.payload;
    },
    updateCReferralSource(state, action) {
      state.customer.referralsource = action.payload;
    },
    updateCName(state, action) {
      state.customer.customer_name = action.payload;
    },
    updateCAdditionalComment(state, action) {
      state.customer.additional_comment = action.payload;
    },
    clearCustomer(state) {
      state.customer = {
        customer_id: "",
        customer_name: "",
        phone_number: "",
        salesExec: "",
        countrycode: "",
        referralsource: "",
      };
    },
    updateSalesExe(state, action) {
      state.customer.salesExec = action.payload;
    },
    updateOtherPaymentCash(state, action) {
      state.otherPayment.cash = action.payload;
    },
    updateOtherPaymentUPI(state, action) {
      state.otherPayment.upi = action.payload;
    },
    updateOtherPaymentCard(state, action) {
      state.otherPayment.card = action.payload;
    },
    updateOtherPaymentCardNo(state, action) {
      state.otherPayment.cardNo = action.payload;
    },
    updateOtherPaymentOther(state, action) {
      state.otherPayment.other = action.payload;
    },
    updateOtherPaymentOtherType(state, action) {
      state.otherPayment.otherType = action.payload;
    },
    clearOtherPayment(state) {
      state.otherPayment = { ...initialOtherPaymentState };
    },
    saveBillResponse(state, action) {
      state.responseData = action.payload;
    },
    saveBillingData(state, action) {
      state.billingData = action.payload;
    },
    toogleDummyBill(state, action) {
      state.dummyBill = action.payload;
    },
    clearBilling(state) {
      state.billingData = {};
    },
    saveInvoiceInBilling(state, action) {
      state.billingData.invoice = action.payload;
    },
    calculateTenderAmount(state, action) {
      state.tender = action.payload;
    },
    loadToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
});

export const {
  prepareCheckout,
  updatePaymentMode,
  updateCardNo,
  updatePaidAmt,
  updateCreditAmt,
  updateCustId,
  updateCPhone,
  updateCPhoneCode,
  updateCReferralSource,
  updateCName,
  updateCAdditionalComment,
  clearCustomer,
  updateSalesExe,
  updateOtherPaymentCash,
  updateOtherPaymentUPI,
  updateOtherPaymentCard,
  updateOtherPaymentCardNo,
  updateOtherPaymentOther,
  updateOtherPaymentOtherType,
  clearOtherPayment,
  saveBillResponse,
  saveBillingData,
  toogleDummyBill,
  clearBilling,
  saveInvoiceInBilling,
  calculateTenderAmount,
  loadToken,
  clearToken,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
