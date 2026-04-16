import { STORE_COUNTER, TOOGLE_LOCATION_POPUP, SET_LOCATION, UPDATE_LOCATION_ID, UPDATE_LOCATION_NAME, CLEAR_COUNTER_DATA } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { get } from "./http"


export const fetchStoreCounter = () => dispatch => {
    let url = UrlHelper.REACT_APP_CONFIG()
    get(url)
        .then(res => res.json())
        .then(counters => dispatch({
            type: STORE_COUNTER,
            payload: counters
        }))
}

export const toogleLocationPopup = (data) => {
    return {
        type: TOOGLE_LOCATION_POPUP,
        payload: data
    }
}

export const setLocation = (data) => {
    return {
        type: SET_LOCATION,
        payload: data
    }
}

export const updateLocationId = (data) => {
    sessionStorage.setItem("user_location_id", data);
    return {
        type: UPDATE_LOCATION_ID,
        payload: data
    }
}

export const updateLocationName = (data) => {
    sessionStorage.setItem("configs_location_name", data);
    return {
        type: UPDATE_LOCATION_NAME,
        payload: data
    }
}

export const clearCounterData = () => {
    return {
        type: CLEAR_COUNTER_DATA
    }
}