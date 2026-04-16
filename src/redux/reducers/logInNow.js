import { LOG_IN_NOW, CLEAR_STORE_DATA, UPDATE_LOCATION_ID, UPDATE_LOCATION_NAME, SAVE_SUBS_DATA } from '../action';


const initialState = {
    data: {}
}

function loginNowReducer(state = initialState, action) {
    let newState = { ...state }

    switch (action.type) {
        case LOG_IN_NOW:
            return {
                ...state,
                data: action.payload
            }
        case UPDATE_LOCATION_ID:
            newState.data.data.location_id = action.payload
            return newState

        case UPDATE_LOCATION_NAME:
            newState.data.configs.location_name = action.payload
            return newState

        case SAVE_SUBS_DATA:
            newState.subs_data = action.payload
            return newState
        case CLEAR_STORE_DATA:
            return {
                ...state,
                data: {}
            }

        default:
            return state
    }

}


export default loginNowReducer;