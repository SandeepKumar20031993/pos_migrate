import { PAGE_TITLE, RETURN_IS_ACTIVE, EDIT_IS_ACTIVE, OPEN_CANCEL_POPUP } from './index';

export const pageTitle = (data) => {
    return {
        type: PAGE_TITLE,
        payload: data
    }
}

export const returnIsActive = (data) => {
    return {
        type: RETURN_IS_ACTIVE,
        payload: data
    }
}

export const editIsActive = (data) => {
    return {
        type: EDIT_IS_ACTIVE,
        payload: data
    }
}

export const openCancelPopup = (data) => {
    return {
        type: OPEN_CANCEL_POPUP,
        payload: data
    }
}