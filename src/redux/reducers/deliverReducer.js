import { APPLY_DELIVERY, CLEAR_DELIVERY, OPEN_DELIVERY_BOX } from "../action";

const initialState = {
    open: false,
    delivery: 0,
    deliveryApplied: false,
};


function Delivery(state = initialState, action) {
    var data = action.payload;

    switch (action.type) {
        case OPEN_DELIVERY_BOX:

            return {
                ...state,
                open: data,
            };

        case APPLY_DELIVERY:

            return { ...state, delivery: data, deliveryApplied: data > 0 ? true : false, open: false };

        case CLEAR_DELIVERY:
            return {
                open: false,
                delivery: 0,
                deliveryApplied: false,
            }

        default:
            return state;
    }
}

export default Delivery;
