import {
    FETCH_PRODUCT_LIST_REQUEST,
    FETCH_PRODUCT_LIST_SUCCESS,
    FETCH_PRODUCT_LIST_FAILURE,
    API_START,
    API_END
} from "../actions/types";

export function productList(state = { isLoadingData: true, data: [], error: null }, action) {
    console.log("productList action type => ", action.type, state);
    switch (action.type) {
        case API_START:
            if (action.payload === FETCH_PRODUCT_LIST_REQUEST) {
                return {
                    ...state,
                    isLoadingData: true
                };
            }
            break;
        case API_END:
            if (action.payload === FETCH_PRODUCT_LIST_REQUEST) {
                return {
                    ...state,
                    isLoadingData: false
                }
            }
            break;
        case FETCH_PRODUCT_LIST_SUCCESS:
            return {
                ...state,
                data: action.payload,
                isLoadingData: false,
                error: null
            };
        case FETCH_PRODUCT_LIST_FAILURE:
            return {
                ...state,
                data: [],
                isLoadingData: false,
                error: action.payload
            };
        default:
            return state;
    }
    return state
}