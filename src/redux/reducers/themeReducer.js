import { PAGE_TITLE,RETURN_IS_ACTIVE,EDIT_IS_ACTIVE,OPEN_CANCEL_POPUP } from '../action';


const initialState = {
    pageTitle:'',
    returnIsActive:false,
    editIsActive:false,
    cancelIsActive:false,
}

function themeReducer (state = initialState, action){

    switch(action.type){
        case PAGE_TITLE:
            return {
                ...state,
                pageTitle:action.payload
            }

        case RETURN_IS_ACTIVE:
            return {
                ...state,
                returnIsActive:action.payload
            }
        case EDIT_IS_ACTIVE:
            return {
                ...state,
                editIsActive:action.payload
            }

        case OPEN_CANCEL_POPUP:
            return {
                ...state,
                cancelIsActive:action.payload
            }

        default:
            return state
    }    

}


export default themeReducer;