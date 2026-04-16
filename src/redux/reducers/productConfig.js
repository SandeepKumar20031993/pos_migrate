import {
    OPEN_PRICE_POPUP,
    SAVE_MULTI_PRICE_PRODUCT,
    SAVE_SELECTED_PRICE,
    CLEAR_MULTI_PRICE_DATA,
    OPEN_QTY_POPUP,
    SAVE_QTY_PRODUCT,
    CLEAR_MANUAL_QTY_DATA,
    TOGGLE_EDIT_PRODUCT_POPUP,
    LOAD_EDITABLE_PRODUCT
} from '../action';


const initialPriceState = {
    product: { prices: [] },
    price: "",
    pricePopup: false,
    editProdPopup: false,
    editableProduct: "",
}
const initialQtyState = {
    qtyPopup: false,
    qtyProduct: {}
}

function productConfig(state = { ...initialPriceState, ...initialQtyState }, action) {

    switch (action.type) {
        case OPEN_PRICE_POPUP:
            return {
                ...state,
                pricePopup: action.payload
            }
        case SAVE_MULTI_PRICE_PRODUCT:
            return {
                ...state,
                product: action.payload
            }
        case SAVE_SELECTED_PRICE:
            return {
                ...state,
                price: action.payload
            }
        case CLEAR_MULTI_PRICE_DATA:
            return {
                ...state,
                ...initialPriceState
            }
        case OPEN_QTY_POPUP:
            return {
                ...state,
                qtyPopup: action.payload
            }
        case SAVE_QTY_PRODUCT:
            return {
                ...state,
                qtyProduct: action.payload
            }
        case CLEAR_MANUAL_QTY_DATA:
            return {
                ...state,
                ...initialQtyState
            }
        case TOGGLE_EDIT_PRODUCT_POPUP:
            return {
                ...state,
                editProdPopup: action.payload
            }
        case LOAD_EDITABLE_PRODUCT:
            return {
                ...state,
                editableProduct: action.payload
            }
        default:
            return state
    }

}


export default productConfig;