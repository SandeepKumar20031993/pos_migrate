import { CLEAR_MEMBERSHIP_ID, LOAD_CUST_REC, CUST_RED_TOTAL, CUST_RED_AMOUNT, COUPON_CHECK, CLEAR_CUSTOMER_DATA, UPDATE_REWARD_PKG_ID, UPDATE_MEMBER_NO, UPDATE_MEMBERSHIP_ID } from '../action';

const initialState = {
    custrecord: [],
    redeemtotal: '',
    redeemamount: '',
    isChecked: false,
    rewardPkgId: "",
    memberNo: "",
    membershipId: "0"
}

function custrecord(state = initialState, action) {
    switch (action.type) {
        case LOAD_CUST_REC:
            return {
                ...state,
                custrecord: action.payload
            }
        case CUST_RED_AMOUNT:
            return {
                ...state,
                redeemamount: action.payload
            }
        case CUST_RED_TOTAL:
            return {
                ...state,
                redeemtotal: action.payload
            }
        case COUPON_CHECK:
            return {
                ...state,
                isChecked: action.payload
            }
        case UPDATE_REWARD_PKG_ID:
            return {
                ...state,
                rewardPkgId: action.payload
            }
        case UPDATE_MEMBER_NO:
            return {
                ...state,
                memberNo: action.payload
            }
        case CLEAR_CUSTOMER_DATA:
            return {
                ...initialState,
                membershipId: state.membershipId
            }
        case CLEAR_MEMBERSHIP_ID:
            return {
                ...state,
                membershipId: "0"
            }
        case UPDATE_MEMBERSHIP_ID:
            return {
                ...state,
                membershipId: action.payload
            }
        default:
            return state
    }

}


export default custrecord;