const loogedReducer = (state = false, action) =>{
    switch(action.type){
        case 'IS_LOGGED_IN':
            return action.payload
            
        default:
            return state;
    }

}

export default loogedReducer;