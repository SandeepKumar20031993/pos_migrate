import { APPLY_MISCELLANEOUS, APPLY_PACKAGING, CLEAR_MISCELLANEOUS, CLEAR_PACKAGING } from './index';


export const applyPackaging = (data) => {
    return { type: APPLY_PACKAGING, payload: data }
}


export const clearPackaging = () => {
    return { type: CLEAR_PACKAGING, }
}