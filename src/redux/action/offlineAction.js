import { SAVE_FOR_BILLING, SAVE_STATUS } from './index';
import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"
import {
    saveOfflineOrder as saveOfflineOrderAction,
    removeOfflineOrder as removeOfflineOrderAction,
    removeAllOfflineOrder as removeAllOfflineOrderAction,
    holdSyncing as holdSyncingAction
} from "../slices/offlineSlice";


export const saveOfflineOrder = (data) => {
    return saveOfflineOrderAction(data)
}

export const saveOfflineBillingData = (data) => {
    return {
        type: SAVE_FOR_BILLING,
        payload: data
    }
}


export const saveOfflineResponseData = (data) => {
    return {
        type: SAVE_STATUS,
        payload: data
    }
}


export const syncOfflineOrder = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_SALE_SAVE();
    return post(url, formData)
}

export const removeOfflineOrder = (index) => {
    return removeOfflineOrderAction(index)
}

export const removeAllOfflineOrder = () => {
    return removeAllOfflineOrderAction()
}

export const holdSyncing = (data) => {
    return holdSyncingAction(data)
}
