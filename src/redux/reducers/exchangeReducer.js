import { CLEAR_EXCHANGE_DATA, EXCHANGE_IS_ACTIVE, SET_EXCHANGE_DATA } from "../action";

const initalState = {
    isActive: false,
    data: null
}

export default function exchangeReducer(state = initalState, action) {
    let data = action.payload;

    switch (action.type) {

        case EXCHANGE_IS_ACTIVE:
            return { ...state, isActive: data }

        case SET_EXCHANGE_DATA:
            return { ...state, data, isActive: false }

        case CLEAR_EXCHANGE_DATA:
            return { ...state, data: null }

        default:
            return state

    }
}