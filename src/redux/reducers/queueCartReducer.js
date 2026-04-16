import { SAVE_QUEUE_CART, TOGGLE_QUEUE_CART } from "../action";

const initialState = {
    total_queue: 0,
    data: null,
    openQueueCart: false
}

export default function queueCartReducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_QUEUE_CART:

            return { ...state, data: action.payload }

        case TOGGLE_QUEUE_CART:
            return { ...state, openQueueCart: action.payload }
        default:
            return state

    }
}