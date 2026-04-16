import { IS_COUPON_APPLIED, OPEN_DISCOUNT_BOX, APPLY_COUPON, APPLY_FLAT_OFF, APPLY_PERCENT_OFF, CLEAR_APPLIED_DISCOUNT, SAVE_COUPON_DATA, SPOT_APPLY_DISCOUNT, IS_CREDIT_NOTE_COUPON, UPDATE_COUPON_INVOICE, SAVE_CREDIT_DATA } from '../action';

const initialState = {
    open: false,
    apply: false,
    coupon: '',
    flatoff: '',
    percentoff: '',
    couponData: {},
    creditData: {},
    spotApply: false,
    is_credit_note: false,
    invoice: ""
}
const clearState = {
    apply: false,
    coupon: '',
    flatoff: '',
    percentoff: '',
    couponData: {},
    creditData: {},
    spotApply: false,
    is_credit_note: false,
    invoice: ""
}

function Discount(state = initialState, action) {

    var data = action.payload;

    switch (action.type) {

        case OPEN_DISCOUNT_BOX:
            return {
                ...state,
                open: data
            }
        case IS_COUPON_APPLIED:
            return {
                ...state,
                apply: data
            }
        case APPLY_COUPON:
            return {
                ...state,
                coupon: data
            }
        case APPLY_FLAT_OFF:
            return {
                ...state,
                flatoff: data
            }
        case APPLY_PERCENT_OFF:
            return {
                ...state,
                percentoff: data
            }
        case SAVE_COUPON_DATA:
            return {
                ...state,
                couponData: data
            }
        case CLEAR_APPLIED_DISCOUNT:
            return {
                ...state,
                ...clearState
            }
        case SPOT_APPLY_DISCOUNT:
            return {
                ...state,
                spotApply: data
            }
        case IS_CREDIT_NOTE_COUPON:
            return {
                ...state,
                is_credit_note: data
            }
        case SAVE_CREDIT_DATA:
            return {
                ...state,
                creditData: data
            }
        case UPDATE_COUPON_INVOICE:
            return {
                ...state,
                invoice: data
            }

        default:
            return state
    }
}

export default Discount;