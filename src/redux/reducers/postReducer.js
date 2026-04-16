import { FETCH_POSTS } from '../action';


const initialState = {
    items:[],
    item:{}
}

function postsReducer (state = initialState, action){
    switch(action.type){
        case FETCH_POSTS:
            return {
                ...state,
                items:action.payload
            }

        default:
            return state
    }    

}


export default postsReducer;