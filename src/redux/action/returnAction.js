import {
    SAVE_RETURNING_INVOICE_NO,
    LOAD_RETURNING_PRODUCTS,
    CLEAR_RETURNING_PRODUCTS,
    SWITCH_RETURNING_PRODUCTS,
    START_RULE_CALCULATION,
    SWITCH_COMPLETE_RETURN
} from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"


export const loadReturningProducts = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_PRODUCT_RETURN_LOAD();
    return post(url, formData)
}

export const saveReturingData = (data) => {
    return {
        type: LOAD_RETURNING_PRODUCTS,
        payload: data
    }
}

export const startRuleCalculation = (data) => {
    return {
        type: START_RULE_CALCULATION,
        payload: data
    }
}

export const clearReturningProducts = () => {

    return {
        type: CLEAR_RETURNING_PRODUCTS
    }

}

export const saveReturingInvoiceNo = (data) => {
    return {
        type: SAVE_RETURNING_INVOICE_NO,
        payload: data
    }
}


export const enableReturnProcess = (data) => {
    return {
        type: SWITCH_RETURNING_PRODUCTS,
        payload: data
    }
}

export const switchCompleteReturn = (data) => {
    return {
        type: SWITCH_COMPLETE_RETURN,
        payload: data
    }
}

export const returnOrder = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_RETURN_ORDER();
    return post(url, formData)
}