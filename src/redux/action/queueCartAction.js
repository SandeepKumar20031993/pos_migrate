import { ALERT, SAVE_QUEUE_CART, TOGGLE_QUEUE_CART } from "."
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"


export const toggleQueueCart = (data) => {
    return { type: TOGGLE_QUEUE_CART, payload: data }
}

export const saveToQueueCart = (queueCart) => dispatch => {
    let url = UrlHelper.REACT_APP_SAVE_QUEUE_CART();

    return post(url, { queueCart });
    /*.then((result) => result.json()).then((data) => {
            console.log("data", data);
            if (data?.success) {
                dispatch({ type: ALERT, alert: true, message: `Your Token is ${data?.data?.token}` })
            }
        }).catch((err) => {
    
        });
     
     */
}

export const loadQueueCart = () => dispatch => {
    let url = UrlHelper.REACT_APP_LOAD_QUEUE_CART();

    post(url, {}).then((result) => result.json()).then((data) => {
        return dispatch({ type: SAVE_QUEUE_CART, payload: data?.data })
    }).catch((err) => {

    });
}