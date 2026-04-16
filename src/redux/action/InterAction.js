import { LOADING, CUSTOM_LOADING, ALERT, RESET_INTERACTION, HANDLE_MISCELLANEOUS_BOX } from './index';


export const loading = (data) => {
    return {
        type: LOADING,
        payload: data
    }
}

export const customLoading = (status, message) => {
    return {
        type: CUSTOM_LOADING,
        status: status,
        message: message
    }
}

export const alert = (alert, message) => {
    return {
        type: ALERT,
        alert: alert,
        message: message
    }
}

export const resetInteraction = () => {
    return {
        type: RESET_INTERACTION
    }
}


export const handleMiscellaneousBox = (data) => {
    return {
        type: HANDLE_MISCELLANEOUS_BOX,
        payload: data
    }
}