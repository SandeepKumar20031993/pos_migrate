import StoreHelper from "./storeHelper";

const helpers = {
  REACT_APP_API_URL: function () {
    return StoreHelper.getStoreApiUrl() + "api/";
  },
  REACT_APP_LOGIN_API: function () {
    return this.REACT_APP_API_URL() + "user/login";
  },
  REACT_APP_CONFIG: function () {
    return this.REACT_APP_API_URL() + "config/load";
  },
  REACT_APP_ITEM_API: function () {
    return this.REACT_APP_API_URL() + "items/load";
  },
  REACT_APP_CATEGORY_LIST_API: function () {
    return this.REACT_APP_API_URL() + "items/category";
  },
  REACT_APP_SALE_SAVE: function () {
    return this.REACT_APP_API_URL() + "sales/create";
  },
  REACT_APP_SALE_GET_INV: function () {
    return this.REACT_APP_API_URL() + "sales/getSaleInvNo";
  },
  REACT_APP_DUMMY_SALE_SAVE: function () {
    return this.REACT_APP_API_URL() + "offlineSales/create";
  },
  REACT_APP_RETURN_SAVE: function () {
    return this.REACT_APP_API_URL() + "sales/salesreturn";
  },
  REACT_APP_EXCHANGE_SAVE: function () {
    return this.REACT_APP_API_URL() + "sales/salesexchange";
  },
  REACT_APP_RETURN_ORDER: function () {
    return this.REACT_APP_API_URL() + "sales/returnorder";
  },
  REACT_APP_PRODUCT_RETURN_LOAD: function () {
    return this.REACT_APP_API_URL() + "sales/loadorder";
  },
  REACT_APP_DUMMY_ORDER_LOAD: function () {
    return this.REACT_APP_API_URL() + "offlineSales/loadorder";
  },
  REACT_APP_EDITINVOICE: function () {
    return this.REACT_APP_API_URL() + "sales/editinvoice";
  },
  REACT_APP_FETCH_OPEN_CLOSE_TILL: function () {
    return this.REACT_APP_API_URL() + "salesregisterapi/fetchopeningtill";
  },
  REACT_APP_SAVE_OPEN_REGISTER: function () {
    return this.REACT_APP_API_URL() + "salesregisterapi/saveopenregister";
  },
  REACT_APP_SAVE_CLOSE_REGISTER: function () {
    return this.REACT_APP_API_URL() + "salesregisterapi/savecloseregister";
  },
  REACT_APP_GET_CASH_REGISTER: function () {
    return this.REACT_APP_API_URL() + "salesregisterapi/getCashRegister";
  },
  REACT_APP_SAVE_CASH_REGISTER: function () {
    return this.REACT_APP_API_URL() + "salesregisterapi/saveCashRegister";
  },
  REACT_APP_FETCH_ORDERS: function () {
    return this.REACT_APP_API_URL() + "sales/fetchorders";
  },
  REACT_APP_SEND_STOCK_REQUEST: function () {
    return this.REACT_APP_API_URL() + "salesregisterapi/create";
  },
  REACT_APP_CANCEL_INVOICE: function () {
    return this.REACT_APP_API_URL() + "sales/cancel";
  },
  REACT_APP_APPLY_COUPON: function () {
    return this.REACT_APP_API_URL() + "sales/applycoupon";
  },
  REACT_APP_APPLY_CUSTOMER_COUPON: function () {
    return this.REACT_APP_API_URL() + "customerapi/applycoupon";
  },
  REACT_APP_LOAD_CUSTOMER_RECORD: function () {
    return this.REACT_APP_API_URL() + "sales/loadcustomer";
  },
  REACT_APP_LOAD_CUSTOMER: function () {
    return this.REACT_APP_API_URL() + "customerapi/loadcustomer";
  },
  REACT_APP_LOAD_NOTIFY_CUSTOMER: function () {
    return this.REACT_APP_API_URL() + "customerapi/notifycustomer";
  },
  REACT_APP_CREATE_CUSTOMER: function () {
    return this.REACT_APP_API_URL() + "customerapi/create";
  },
  REACT_APP_CREATE_PRODUCT: function () {
    return this.REACT_APP_API_URL() + "items/create";
  },
  REACT_APP_UPDATE_PRODUCT: function () {
    return this.REACT_APP_API_URL() + "items/update";
  },
  REACT_APP_CREATE_APPOINTMENT: function () {
    return this.REACT_APP_API_URL() + "sales/createAppointment";
  },
  REACT_APP_LOAD_APPOINTMENT: function () {
    return this.REACT_APP_API_URL() + "sales/loadAppointments";
  },
  REACT_APP_CANCEL_APPOINTMENT: function () {
    return this.REACT_APP_API_URL() + "sales/cancelAppointment";
  },
  REACT_APP_LOAD_CATEGORY: function () {
    return this.REACT_APP_API_URL() + "items/category";
  },
  REACT_APP_CREATE_CREDIT_NOTE: function () {
    return this.REACT_APP_API_URL() + "creditnoteapi/create";
  },
  REACT_APP_CREDIT_NOTE_APPLY: function () {
    return this.REACT_APP_API_URL() + "creditnoteapi/apply";
  },
  REACT_APP_CREDIT_PAYMENTS: function () {
    return this.REACT_APP_API_URL() + "customerapi/creditpayments";
  },
  REACT_APP_UPDATE_CREDIT_PAYMENTS: function () {
    return this.REACT_APP_API_URL() + "customerapi/updateCredit";
  },
  REACT_APP_CUSTOMER_HISTORY: function () {
    return this.REACT_APP_API_URL() + "customerapi/history";
  },
  REACT_APP_SEARCH_CUSTOMER: function () {
    return this.REACT_APP_API_URL() + "customerapi/searchByCustomer";
  },
  REACT_APP_DUE_DAYS: function () {
    return this.REACT_APP_API_URL() + "paymentapi/duedays";
  },
  REACT_APP_GET_SURVEY_QUESTIONS: function () {
    return this.REACT_APP_API_URL() + "Surveyapi/getAllQuestions";
  },
  REACT_APP_SUBMIT_SURVEY_FEEDBACK: function () {
    return this.REACT_APP_API_URL() + "Surveyapi/submitFeedBack";
  },
  REACT_APP_LOGOUT_API: function () {
    return this.REACT_APP_API_URL() + "user/logout";
  },

  REACT_APP_SALES_POS_INITIATE_PAYMENT: function () {
    return this.REACT_APP_API_URL() + "sales/createpayment"; //'items/testing'
  },
  REACT_APP_SALES_POS_CHECKSTATUS_PAYMENT: function () {
    return this.REACT_APP_API_URL() + "sales/checkPaymentStatus";
  },

  REACT_APP_SALES_POS_PL_UPLOAD_PAYMENT: function () {
    return this.REACT_APP_API_URL() + "sales/uploadPaymentPL";
  },
  REACT_APP_SALES_POS_PL_PAYMENT_STATUS: function () {
    return this.REACT_APP_API_URL() + "sales/statusCheckPL";
  },
  REACT_APP_SALES_POS_PL_PAYMENT_CANEL: function () {
    return this.REACT_APP_API_URL() + "sales/cancelPLPayments";
  },
  REACT_APP_SALES_REPORTS_GET: function () {
    return this.REACT_APP_API_URL() + "sales/salesReports";
  },
  REACT_APP_SAVE_QUEUE_CART: function () {
    return this.REACT_APP_API_URL() + "sales/saveQueueCart";
  },
  REACT_APP_LOAD_QUEUE_CART: function () {
    return this.REACT_APP_API_URL() + "sales/getQueueCart";
  },

};

export default helpers;
