import {
    SAVE_RETURNING_INVOICE_NO,
    LOAD_RETURNING_PRODUCTS,
    CLEAR_RETURNING_PRODUCTS,
    SWITCH_RETURNING_PRODUCTS,
    START_RULE_CALCULATION,
    SWITCH_COMPLETE_RETURN
} from '../action';


function Return(state = {}, action) {

    var payload = action.payload;

    switch (action.type) {

        case SAVE_RETURNING_INVOICE_NO:
            return {
                ...state,
                invoice: payload
            }
        case LOAD_RETURNING_PRODUCTS:
            return {
                ...state,
                ...payload
            }
        case CLEAR_RETURNING_PRODUCTS:
            return {}

        case SWITCH_RETURNING_PRODUCTS:
            return {
                ...state,
                ...payload
            }
        case START_RULE_CALCULATION:
            return {
                ...state,
                startRule: payload
            }
        case SWITCH_COMPLETE_RETURN:
            return {
                ...state,
                completeReturn: payload
            }
        default:
            return state
    }
}

export default Return;