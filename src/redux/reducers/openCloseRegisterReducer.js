import { SAVE_DENOMINATION, CLEAR_OPEN_CLOSE_REGISTER, FETCH_OPEN_CLOSE_REGISTER,SAVE_OPEN_CLOSE_REGISTER } from '../action';

function OpenCloseRegister (state={denom:{},fetched:{}} , action){

    switch(action.type){
        case SAVE_DENOMINATION:
            return {
                ...state,
                denom:action.payload
            }

        case FETCH_OPEN_CLOSE_REGISTER:
            return {
                ...state,
                fetched:action.payload
            }
        case CLEAR_OPEN_CLOSE_REGISTER:
            
            return {
                ...state,
                fetched:{}
            }

        case SAVE_OPEN_CLOSE_REGISTER:
            return {
                ...state
            }


        default:
            return state
    }
}
    
export default OpenCloseRegister;