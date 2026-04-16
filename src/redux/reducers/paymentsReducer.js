import {
    INITIATE_PAYMENTS,
    CHECK_PAYMENT_STATUS,
    SET_PAYMENT_DATA,
    CLEAR_POS_PAYMENTS,
    SET_PINE_LAB_PTR_ID,
    SET_PINE_LAB_TRANS_ID,
    CLEAR_PINELABS_DATA,
    CLOSE_OPEN_TRANS,
} from "../action/index";

const initialState = {
    paymentType: "",
    total: "",
    data: {},
    urn: null,
    tid: null,
    pineLabs: {
        ptrID: null,
        trans_id: null,

    },
    openTrans: {
        ref_id: null,
        amount: null
    }
};

function paymentsReducer(state = initialState, action) {
    const data = action.payload;

    switch (action.type) {
        case INITIATE_PAYMENTS:
            return { ...state, paymentType: "", data: action.payload };

        case SET_PAYMENT_DATA:
            let finalState = state;
            // payment_type

            if (data.paymentType) {
                finalState.paymentType = data.paymentType;
            }
            if (data.urn) {
                finalState.urn = data.urn;
            }
            if (data.tid) {
                finalState.tid = data.tid;
            }

            if (data.data) {
                finalState.data = data.data;
            }

            return finalState;

        case CLEAR_POS_PAYMENTS:
            return initialState;

        case SET_PINE_LAB_PTR_ID:
            let pineLabs = { trans_id: null, ptrID: data?.ref_id };
            return { ...state, pineLabs, openTrans: { ref_id: data?.ref_id, amount: data?.amount } };

        case SET_PINE_LAB_TRANS_ID:
            return { ...state, pineLabs: { ...state.pineLabs, trans_id: data ?? null }, openTrans: { ref_id: null, amount: null } };
        case CLOSE_OPEN_TRANS:
            return { ...state, openTrans: { ref_id: null, amount: null } }
        case CLEAR_PINELABS_DATA:
            return {
                ...state, pineLabs: {
                    ptrID: null,
                    trans_id: null,
                }
            }
        default:
            return state;
    }
}

export default paymentsReducer;
