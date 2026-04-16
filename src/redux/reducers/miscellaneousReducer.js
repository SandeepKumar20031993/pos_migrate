import { APPLY_MISCELLANEOUS, APPLY_PACKAGING, CLEAR_MISCELLANEOUS, CLEAR_PACKAGING } from "../action";

const initialState = {

    packaging: 0,
    packagingApplied: false,
};


function Miscellaneous(state = initialState, action) {
    var data = action.payload;

    switch (action.type) {


        case APPLY_PACKAGING:


            return { ...state, packaging: data, packagingApplied: data > 0 ? true : false };

        case CLEAR_PACKAGING:
            return {
                packaging: 0,
                packagingApplied: false,
            }

        default:
            return state;
    }
}

export default Miscellaneous;