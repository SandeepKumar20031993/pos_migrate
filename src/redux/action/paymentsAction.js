import { CLEAR_PINELABS_DATA, CLEAR_POS_PAYMENTS, CLOSE_OPEN_TRANS, SET_PAYMENT_DATA, SET_PINE_LAB_PTR_ID, SET_PINE_LAB_TRANS_ID } from "./index";

import UrlHelper from "../../Helper/urlHelper";
import { post } from "./http";


// let value = 'hFQQ8uvej75AtBatJ/7G8n1sGoJGGHB+QZq+1FZ3yfhpKu+ur4M1uAh7Jy9QbG5PQW/Vi/ZSO+AI7ouRE2eoD8wS6FbvdDKE4UimFaXGqcwwqa5IUhZkk6RIcAsUqEk+'

// let plain = { "urn": "2507", "tid": "1192685U", "additional_attribute1": "", "request_urn": "" }


export const setPaymentData = (data) => {
    return { type: SET_PAYMENT_DATA, payload: data }
}
export const cleaPosPaymentsData = () => {
    return { type: CLEAR_POS_PAYMENTS }
}

export const setPinelabsPtrID = (data) => {
    return { type: SET_PINE_LAB_PTR_ID, payload: data }
}
export const setPinelabsTransID = (data) => {
    return { type: SET_PINE_LAB_TRANS_ID, payload: data }
}
export const clearPineLabsData = () => {
    return { type: CLEAR_PINELABS_DATA }
}
export const close_optnTrans = () => {
    return { type: CLOSE_OPEN_TRANS }
}


/** for pinelabs initialte payment */
export const initiatePLPayment = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALES_POS_PL_UPLOAD_PAYMENT();
    return post(url, formData);
}
/** for pinelabs check payment status */
export const checkPLPaymentStatus = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALES_POS_PL_PAYMENT_STATUS();
    return post(url, formData);
}
/** for pinelabs check payment status */
export const cancelPLPayment = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALES_POS_PL_PAYMENT_CANEL();
    return post(url, formData);
}




export const initiatePayment = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALES_POS_INITIATE_PAYMENT();
    return post(url, formData);
}

export const checkPaymentStatus = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALES_POS_CHECKSTATUS_PAYMENT();
    return post(url, formData);
}



