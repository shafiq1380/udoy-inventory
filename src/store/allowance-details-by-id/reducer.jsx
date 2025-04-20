import {
    FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST,
    FETCH_ALLOWANCE_DETAILS_BY_ID_SUCCESS,
    FETCH_ALLOWANCE_DETAILS_BY_ID_FAILURE,
    FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST,
    FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_SUCCESS,
    FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_FAILURE
} from "./actions";

const initialState = {
    loading: false,
    allowanceDetailsById: [],
    allowanceDataUpdateById: [],
    error: null
};

const allowanceDetailsByIdReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_ALLOWANCE_DETAILS_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                allowanceDetailsById: action.payload
            }
        case FETCH_ALLOWANCE_DETAILS_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                allowanceDataUpdateById: action.payload
            }
        case FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
};


export default allowanceDetailsByIdReducer;