import { post } from "./http"
import UrlHelper from "../../Helper/urlHelper";
import { loadCashRegisterData as loadCashRegisterDataAction } from "../slices/cashRegisterSlice";


export const getCashRegisterApi = (payload) => dispatch => {
    let url = UrlHelper.REACT_APP_GET_CASH_REGISTER();

    return post(url, payload)

}

export const saveCashRegisterApi = (payload) => dispatch => {
    let url = UrlHelper.REACT_APP_SAVE_CASH_REGISTER();

    return post(url, payload)

}

export const loadCashRegisterData = (payload) => {
    return loadCashRegisterDataAction(payload)
}
