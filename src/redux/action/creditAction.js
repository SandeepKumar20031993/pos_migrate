import { TOGGLE_CREDIT_POPUP, LOAD_CREDIT_PRODUCTS, CLEAR_CREDIT_PRODUCTS, TOGGLE_CREDIT_SUCCESS_POPUP, UPDATE_CREDIT_INVOICE, SAVE_CREDIT_RES, CLEAR_CREDIT_DATA, UPDATE_PHONE_IN_CREDDATA } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"


export const loadCreditProducts = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    return post(url, formData).then(res => {
        dispatch(saveCreditData(res));
        return res;
    });
}

export const createCreditNote = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_CREATE_CREDIT_NOTE();
    return post(url, formData)
}

export const saveCreditData = (data) => {
    return {
        type: LOAD_CREDIT_PRODUCTS,
        payload: data
    }
}

export const updatePhoneInCredData = (data) => {
    return {
        type: UPDATE_PHONE_IN_CREDDATA,
        payload: data
    }
}

export const toggleCreditPopup = (data) => {
    return {
        type: TOGGLE_CREDIT_POPUP,
        payload: data
    }
}

export const toggleCreditSuccessPopup = (data) => {
    return {
        type: TOGGLE_CREDIT_SUCCESS_POPUP,
        payload: data
    }
}

export const updateCreditInv = (data) => {
    return {
        type: UPDATE_CREDIT_INVOICE,
        payload: data
    }
}

export const saveCreditRes = (data) => {
    return {
        type: SAVE_CREDIT_RES,
        payload: data
    }
}

export const clearCreditProducts = () => {
    return {
        type: CLEAR_CREDIT_PRODUCTS
    }
}

export const clearCreditData = () => {
    return {
        type: CLEAR_CREDIT_DATA
    }
}

export const loadCreditPayments = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_CREDIT_PAYMENTS();
    return post(url, formData)
}

export const updateCreditPayments = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_UPDATE_CREDIT_PAYMENTS();
    return post(url, formData)
}
