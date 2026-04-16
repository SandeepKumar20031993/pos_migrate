import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"
import { setSalesRecord } from "../slices/salesRecordSlice";



export const loadSalesRecord = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_FETCH_ORDERS();
    post(url, formData)
        .then(res => res.json())
        .then(resData => dispatch(setSalesRecord(resData)))
        .catch(err => dispatch(setSalesRecord({})))
}

export const getCashRegisterReport = (payload) => {
    let url = UrlHelper.REACT_APP_SALES_REPORTS_GET();

    return post(url, payload).then(result => result.json());
}
