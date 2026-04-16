import { STORE_COUNTER, TOOGLE_LOCATION_POPUP, SET_LOCATION, CLEAR_COUNTER_DATA } from '../action';


const initialState = {
    counters: {},
    location: {
        popup: false,
        location: {}
    }
}

function storeCounterReducer(state = initialState, action) {
    let newState = { ...state }

    switch (action.type) {
        case STORE_COUNTER:
            newState.counters = action.payload
            return newState

        case TOOGLE_LOCATION_POPUP:
            newState.location.popup = action.payload
            return newState

        case SET_LOCATION:
            newState.location.location = action.payload
            return newState
        case CLEAR_COUNTER_DATA:
            return initialState
        default:
            return state
    }
}


export default storeCounterReducer;