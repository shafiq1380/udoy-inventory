import { FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST, FETCH_ALLOWANCE_LISTS_BY_TYPE_SUCCESS, FETCH_ALLOWANCE_LISTS_BY_TYPE_FAILURE } from "./actions";

const initialState = {
    loading: false,
    allowanceListsByType: [],
    error: null
};

const allowanceListsByTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_ALLOWANCE_LISTS_BY_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                allowanceListsByType: action.payload
            }
        case FETCH_ALLOWANCE_LISTS_BY_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
};


export default allowanceListsByTypeReducer;