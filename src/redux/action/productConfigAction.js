import {
    openPricePopup as openPricePopupAction,
    saveMultiPriceProduct as saveMultiPriceProductAction,
    saveSelectedPrice as saveSelectedPriceAction,
    clearMultiPriceData as clearMultiPriceDataAction,
    openQtyPopup as openQtyPopupAction,
    toggleEditProductPopup as toggleEditProductPopupAction,
    loadEditableProduct as loadEditableProductAction,
    saveQtyProduct as saveQtyProductAction,
    clearQtyData as clearQtyDataAction
} from "../slices/productConfigSlice";

export const openPricePopup = (data) => {
    return openPricePopupAction(data);
}

export const saveMultiPriceProduct = (data) => {
    return saveMultiPriceProductAction(data);
}

export const saveSelectedPrice = (data) => {
    return saveSelectedPriceAction(data);
}

export const clearMultiPriceData = () => {
    return clearMultiPriceDataAction();
}

export const openQtyPopup = (data) => {
    return openQtyPopupAction(data);
}

export const toggleEditProductPopup = (data) => {
    return toggleEditProductPopupAction(data);
}

export const loadEditableProduct = (data) => {
    return loadEditableProductAction(data);
}

export const saveQtyProduct = (data) => {
    return saveQtyProductAction(data);
}

export const clearQtyData = () => {
    return clearQtyDataAction();
}
