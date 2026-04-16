import { LOAD_CUST_REC, CUST_RED_TOTAL, CUST_RED_AMOUNT, COUPON_CHECK, CLEAR_CUSTOMER_DATA, UPDATE_REWARD_PKG_ID, UPDATE_MEMBER_NO, SAVE_SUBS_DATA, UPDATE_MEMBERSHIP_ID, CLEAR_MEMBERSHIP_ID } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post, get } from "./http"


export const fetch_customer_data = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_LOAD_CUSTOMER_RECORD();
    return post(url, formData)
}

export const loadCustomer = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_LOAD_CUSTOMER();
    return post(url, formData)
}

export const createCustomer = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_CREATE_CUSTOMER();
    return post(url, formData)
}

export const fetchCustomerHistory = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_CUSTOMER_HISTORY();
    return post(url, formData)
}


export const save_customer_data = (data) => {
    return {
        type: LOAD_CUST_REC,
        payload: data
    }
}

export const apply_redeem_amount = (data) => {
    return {
        type: CUST_RED_AMOUNT,
        payload: data
    }
}

export const apply_redeem_coupon = (data) => {
    return {
        type: CUST_RED_TOTAL,
        payload: data
    }
}

export const setChecked = (data) => {
    return {
        type: COUPON_CHECK,
        payload: data
    }
}

export const updateRewardPkgId = (data) => {
    return {
        type: UPDATE_REWARD_PKG_ID,
        payload: data
    }
}

export const updateMemberNo = (data) => {
    return {
        type: UPDATE_MEMBER_NO,
        payload: data
    }
}


export const clear_customer_data = () => {

    return {
        type: CLEAR_CUSTOMER_DATA,
    }
}

export const clearMembershipID = () => {
    return {
        type: CLEAR_MEMBERSHIP_ID,
    }
}

export const updateMembershipID = (data) => {
    return {
        type: UPDATE_MEMBERSHIP_ID,
        payload: data
    }
}

export const notifyCustomer = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_LOAD_NOTIFY_CUSTOMER();
    return post(url, formData)
}

export const checkDueDate = () => dispatchDataToReducer => {
    let url = UrlHelper.REACT_APP_DUE_DAYS();
    get(url)
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                dispatchDataToReducer({
                    type: SAVE_SUBS_DATA,
                    payload: resData
                })
            }
        })
        .catch(err => {

        })
}


export const getSurveyQuestions = (formData) => disp => {
    let url = UrlHelper.REACT_APP_GET_SURVEY_QUESTIONS()
    return post(url, formData);
}

export const submitSurvey = (formData) => disp => {
    let url = UrlHelper.REACT_APP_SUBMIT_SURVEY_FEEDBACK()
    return post(url, formData);
}