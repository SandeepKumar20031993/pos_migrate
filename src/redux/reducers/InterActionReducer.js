import { LOADING, CUSTOM_LOADING, ALERT, RESET_INTERACTION, HANDLE_MISCELLANEOUS_BOX } from '../action';


const initialState = {
    loading: false,
    customLoading: false,
    customLoadingMsg: "",
    alert: false,
    alertMessage: "",
    openMiscellaneousBox: false
}

function InterActionReducer(state = initialState, action) {

    switch (action.type) {
        case LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case CUSTOM_LOADING:
            return {
                ...state,
                customLoading: action.status,
                customLoadingMsg: action.message
            }
        case ALERT:
            return {
                ...state,
                alert: action.alert,
                alertMessage: action.message
            }
        case RESET_INTERACTION:
            return {
                ...initialState
            }
        case HANDLE_MISCELLANEOUS_BOX:
            return {
                ...state,
                openMiscellaneousBox: action.payload
            }
        default:
            return state
    }

}


export default InterActionReducer;