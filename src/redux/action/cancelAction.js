import { LOAD_CANCEL_INVOICE_DATA, SAVE_CANCEL_INVOICE_DATA, CLEAR_CANCEL_INVOICE_DATA } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"


export const loadCancelInvoiceData = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: LOAD_CANCEL_INVOICE_DATA,
            payload: resData
        }))
}

export const saveCancelInvoice = (data) => {
    return {
        type: SAVE_CANCEL_INVOICE_DATA,
        payload: data
    }
}

export const clearCancelInvoice = () => {
    return {
        type: CLEAR_CANCEL_INVOICE_DATA
    }
}

export const cancelNow = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_CANCEL_INVOICE();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: LOAD_CANCEL_INVOICE_DATA,
            payload: resData
        }))
}

