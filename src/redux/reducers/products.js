import { SEND_STOCK_REQUEST, SAVE_CATEGORIES, SAVE_CATEGORY_PRODUCTS, SAVE_BESTSELLING_PRODUCTS, SAVE_RECOMMENDED_PRODUCTS, TOOGLE_CREATE_PRODUCT, CLEAR_PRODUCTS_DATA, SAVE_PRODUCT_RULES } from '../action';

const initialState = {
    bestsellings: [],
    category_products: [],
    recommended: [],
    categories: [],
    rules: [],
    createPopup: false
}

function products(state = initialState, action) {
    switch (action.type) {
        case SAVE_CATEGORY_PRODUCTS:
            return {
                ...state,
                category_products: action.payload
            }

        case SAVE_BESTSELLING_PRODUCTS:
            return {
                ...state,
                bestsellings: action.payload
            }

        case SAVE_RECOMMENDED_PRODUCTS:
            return {
                ...state,
                recommended: action.payload
            }

        case SAVE_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }

        case SAVE_PRODUCT_RULES:
            return {
                ...state,
                rules: action.payload
            }

        case SEND_STOCK_REQUEST:
            return {
                ...state
            }

        case TOOGLE_CREATE_PRODUCT:
            return {
                ...state,
                createPopup: action.payload
            }
        case CLEAR_PRODUCTS_DATA:
            return initialState
        default:
            return state
    }

}


export default products;