import { TOGGLE_CREDIT_POPUP, LOAD_CREDIT_PRODUCTS, CLEAR_CREDIT_PRODUCTS, TOGGLE_CREDIT_SUCCESS_POPUP, UPDATE_CREDIT_INVOICE, SAVE_CREDIT_RES, CLEAR_CREDIT_DATA, UPDATE_PHONE_IN_CREDDATA } from '../action';

const initialState = {
    popup: false,
    success: false,
    invoice: "",
    credData: {},
    crRes: {}
}

function Return(state = initialState, action) {
    var payload = action.payload;
    let newState = { ...state }

    switch (action.type) {
        case TOGGLE_CREDIT_POPUP:
            return {
                ...state,
                popup: payload
            }
        case TOGGLE_CREDIT_SUCCESS_POPUP:
            return {
                ...state,
                success: payload
            }
        case LOAD_CREDIT_PRODUCTS:
            return {
                ...state,
                credData: payload
            }
        case UPDATE_PHONE_IN_CREDDATA:
            newState.credData.customer.phone_number = payload
            return newState

        case UPDATE_CREDIT_INVOICE:
            return {
                ...state,
                invoice: payload
            }
        case SAVE_CREDIT_RES:
            return {
                ...state,
                crRes: payload
            }
        case CLEAR_CREDIT_PRODUCTS:
            return {
                ...state,
                credData: {}
            }
        case CLEAR_CREDIT_DATA:
            return {
                ...initialState
            }
        default:
            return state
    }
}

export default Return;