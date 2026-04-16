import { SAVE_DENOMINATION, CLEAR_OPEN_CLOSE_REGISTER, FETCH_OPEN_CLOSE_REGISTER, SAVE_OPEN_CLOSE_REGISTER } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { get, post } from "./http"

export const saveDenomination = (data) => {
    return {
        type: SAVE_DENOMINATION,
        payload: data
    }
}

export const loadRegister = () => dispatch => {
    let url = UrlHelper.REACT_APP_FETCH_OPEN_CLOSE_TILL();
    get(url)
        .then(res => res.json())
        .then(data => dispatch({
            type: FETCH_OPEN_CLOSE_REGISTER,
            payload: data
        }))
}

export const clearRegister = () => {
    return {
        type: CLEAR_OPEN_CLOSE_REGISTER
    }
}

export const saveOpenRegister = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SAVE_OPEN_REGISTER();
    return post(url, formData)
}
export const saveOpenRegisterData = (data) => {
    return {
        type: SAVE_OPEN_CLOSE_REGISTER,
        payload: data
    }
}
export const saveCloseRegister = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SAVE_CLOSE_REGISTER();
    return post(url, formData)
}