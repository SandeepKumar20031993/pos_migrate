import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"
import {
    addToCart as addToCartAction,
    addToCartWithQty as addToCartWithQtyAction,
    updateQty as updateQtyAction,
    updateProductWithQty as updateProductWithQtyAction,
    updateCartPrice as updateCartPriceAction,
    changeQty as changeQtyAction,
    updateProduct as updateProductAction,
    decreaseQty as decreaseQtyAction,
    removeCartItem as removeCartItemAction,
    clearCart as clearCartAction,
    restoreSuspendedCartProduct as restoreSuspendedCartProductAction
} from '../slices/cartSlice';
import {
    prepareCheckout as prepareCheckoutAction,
    updatePaymentMode as updatePaymentModeAction,
    updateCardNo as updateCardNoAction,
    updateCName as updateCNameAction,
    updateCAdditionalComment as updateCAdditionalCommentAction,
    updateCPhone as updateCPhoneAction,
    updateCPhoneCode as updateCPhoneCodeAction,
    updateCReferralSource as updateCReferralSourceAction,
    updateCustId as updateCustIdAction,
    clearCustomer as clearCustomerAction,
    updateSalesExe as updateSalesExeAction,
    updateOtherPaymentCash as updateOtherPaymentCashAction,
    updateOtherPaymentCard as updateOtherPaymentCardAction,
    updateOtherPaymentUPI as updateOtherPaymentUPIAction,
    updateOtherPaymentCardNo as updateOtherPaymentCardNoAction,
    updateOtherPaymentOther as updateOtherPaymentOtherAction,
    updateOtherPaymentOtherType as updateOtherPaymentOtherTypeAction,
    clearOtherPayment as clearOtherPaymentAction,
    saveBillResponse as saveBillResponseAction,
    calculateTenderAmount as calculateTenderAmountAction,
    saveBillingData as saveBillingDataAction,
    saveInvoiceInBilling as saveInvoiceInBillingAction,
    toogleDummyBill as toogleDummyBillAction,
    updatePaidAmt as updatePaidAmtAction,
    updateCreditAmt as updateCreditAmtAction,
    loadToken as loadTokenAction,
    clearToken as clearTokenAction,
    clearBilling as clearBillingAction
} from '../slices/checkoutSlice';
import {
    suspendCart as suspendCartAction,
    removeFromSuspended as removeFromSuspendedAction,
    clearSuspendedCart as clearSuspendedCartAction
} from '../slices/suspendedCartSlice';

export const AddToCart = (products) => {
    return addToCartAction(products)
}

export const AddToCartWithQty = (products) => {
    return addToCartWithQtyAction(products)
}

export const updateQty = (products) => {
    return updateQtyAction(products)
}

export const updateProductWithQty = (products) => {
    return updateProductWithQtyAction(products)
}

export const updateCartPrice = (product) => {
    return updateCartPriceAction(product)
}

export const changeQty = (data) => {
    return changeQtyAction(data)
}

export const updateProduct = (data) => {
    return updateProductAction(data)
}

export const decreaseQty = (product) => {
    return decreaseQtyAction(product)
}

export const removeCartItem = (index, product) => {
    return removeCartItemAction(index)
}

export const clearCart = () => {
    return clearCartAction()
}

export const clearBilling = () => {
    return clearBillingAction()
}

export const prepareCheckout = (data) => {
    return prepareCheckoutAction(data)
}

export const updatePaymentMode = (data) => {
    return updatePaymentModeAction(data)
}


export const updateCardNo = (data) => {
    return updateCardNoAction(data)
}


export const updateCName = (data) => {
    return updateCNameAction(data)
}

export const updateCAdditionalComment = (data) => {
    return updateCAdditionalCommentAction(data)
}

export const updateCPhone = (data) => {
    return updateCPhoneAction(data)
}

export const updateCPhoneCode = (data) => {
    return updateCPhoneCodeAction(data)
}

export const updateCReferralSource = (data) => {
    return updateCReferralSourceAction(data)
}

export const updateCustId = (data) => {
    return updateCustIdAction(data)
}

export const clearCustomer = () => {
    return clearCustomerAction()
}

export const updateSalesExe = (data) => {
    return updateSalesExeAction(data)
}

export const updateOtherPaymentCash = (data) => {
    return updateOtherPaymentCashAction(data)
}

export const updateOtherPaymentCard = (data) => {
    return updateOtherPaymentCardAction(data)
}

export const updateOtherPaymentUPI = (data) => {
    return updateOtherPaymentUPIAction(data)
}

export const updateOtherPaymentCardNo = (data) => {
    return updateOtherPaymentCardNoAction(data)
}


export const updateOtherPaymentOther = (data) => {
    return updateOtherPaymentOtherAction(data)
}

export const updateOtherPaymentOtherType = (data) => {
    return updateOtherPaymentOtherTypeAction(data)
}

export const clearOtherPayment = (data) => {
    return clearOtherPaymentAction(data)
}


export const generateBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALE_SAVE();
    return post(url, formData);
}

export const saveBillResponse = (data) => {
    return saveBillResponseAction(data)
}

export const generateDummyBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_DUMMY_SALE_SAVE();
    return post(url, formData);
}

export const updateGeneratedBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_RETURN_SAVE();
    return post(url, formData);
}

export const getSaleInvNo = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALE_GET_INV();
    return post(url, formData);
}

export const generateExchangeOrder = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_EXCHANGE_SAVE();
    return post(url, formData);
}


export const updateEditedBill = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_EDITINVOICE();
    return post(url, formData);
}


export const calculateTenderAmount = (data) => {
    return calculateTenderAmountAction(data)
}

export const suspendCart = (data) => {
    return suspendCartAction(data)
}

export const restoreCartProduct = (data) => {
    return restoreSuspendedCartProductAction(data)
}

export const removeFromSuspended = (index) => {
    return removeFromSuspendedAction(index)
}

export const clearSuspendedCart = (index) => {
    return clearSuspendedCartAction()
}

export const loadBillingData = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    return post(url, formData);
}

export const fetchOrder = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    return post(url, formData);
}

export const loadDummyBillingData = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_DUMMY_ORDER_LOAD();
    return post(url, formData);
}

export const saveBillingData = (data) => {
    return saveBillingDataAction(data)
}

export const saveInvoiceInBilling = (data) => {
    return saveInvoiceInBillingAction(data)
}

export const toogleDummyBill = (data) => {
    return toogleDummyBillAction(data)
}


export const updatePaidAmt = (data) => {
    return updatePaidAmtAction(data)
}

export const updateCreditAmt = (data) => {
    return updateCreditAmtAction(data)
}

export const loadToken = (payload) => ({
    ...loadTokenAction(payload)
})

export const clearToken = () => ({
    ...clearTokenAction()
})
