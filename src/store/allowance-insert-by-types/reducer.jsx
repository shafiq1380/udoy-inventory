import { FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST, FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_SUCCESS, FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_FAILURE } from "./actions";

const initialState = {
    loading: false,
    allowanceDataForInsertByType: [],
    error: null
};

const allowanceDataForInsertByTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                allowanceDataForInsertByType: action.payload
            }
        case FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};


export default allowanceDataForInsertByTypeReducer;