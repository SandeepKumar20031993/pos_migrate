import { SAVE_EDIT_INVOICE_NO, LOAD_EDIT_PRODUCTS, CLEAR_EDIT_PRODUCTS } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"

export const loadEditProducts = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch({
            type: LOAD_EDIT_PRODUCTS,
            payload: resData
        }))
}

export const clearEditProducts = () => {
    return {
        type: CLEAR_EDIT_PRODUCTS
    }
}

export const saveEditInvoiceNo = (data) => {
    return {
        type: SAVE_EDIT_INVOICE_NO,
        payload: data
    }
}