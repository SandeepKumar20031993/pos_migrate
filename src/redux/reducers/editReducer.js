import { SAVE_EDIT_INVOICE_NO,LOAD_EDIT_PRODUCTS,CLEAR_EDIT_PRODUCTS } from '../action';

// const initialState = {
//     invoice:'',
//     alertMessage:''
// }

function Edit (state={} , action){

    var newProduct = action.payload;

    switch(action.type){

        case SAVE_EDIT_INVOICE_NO:
            return {
                ...state,
                invoice:newProduct
            }
        case LOAD_EDIT_PRODUCTS:
            return {
                ...state,
                ...newProduct
            }
        case CLEAR_EDIT_PRODUCTS:
            return {}

        default:
            return state
    }
}
    
export default Edit;