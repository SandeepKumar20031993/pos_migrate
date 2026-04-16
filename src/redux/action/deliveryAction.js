import { APPLY_DELIVERY, CLEAR_DELIVERY, OPEN_DELIVERY_BOX } from './index';


export const openDeliveryBox = (data) => {
    return {
        type: OPEN_DELIVERY_BOX,
        payload: data
    }
}


export const applyDelivery = (data) => {
    return { type: APPLY_DELIVERY, payload: data }
}


export const clearDelivery = data => {
    return { type: CLEAR_DELIVERY, payload: data }
}