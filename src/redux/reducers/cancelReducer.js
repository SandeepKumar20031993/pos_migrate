import {LOAD_CANCEL_INVOICE_DATA,SAVE_CANCEL_INVOICE_DATA,CLEAR_CANCEL_INVOICE_DATA} from '../action';

const initialState = {

}

function Edit (state=initialState , action){

    switch(action.type){

        case LOAD_CANCEL_INVOICE_DATA:
            return {
                ...state,
                ...action.payload
            }
        case SAVE_CANCEL_INVOICE_DATA:
            return {
                ...state,
                invoice:action.payload
            }
        case CLEAR_CANCEL_INVOICE_DATA:
            return initialState
        default:
            return state
    }
}
    
export default Edit;