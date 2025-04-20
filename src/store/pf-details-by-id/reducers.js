import {
    FETCH_PF_DETAILS_BY_ID_REQUEST,
    FETCH_PF_DETAILS_BY_ID_SUCCESS,
    FETCH_PF_DETAILS_BY_ID_FAILURE,
    PF_DATA_FOR_UPDATE_BY_ID_REQUEST,
    PF_DATA_FOR_UPDATE_BY_ID_SUCCESS,
    PF_DATA_FOR_UPDATE_BY_ID_FAILURE
} from "./actions";

const initialState = {
    loading: false,
    pfDetailsById: [],
    pfDataUpdateLists: [],
    error: null
};

const pfDetailsByIdReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PF_DETAILS_BY_ID_REQUEST:
            return {
                ...state,
                pfDetailsById: [],
                loading: true
            }
        case FETCH_PF_DETAILS_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                pfDetailsById: action.payload
            }
        case FETCH_PF_DETAILS_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case PF_DATA_FOR_UPDATE_BY_ID_REQUEST:
            return {
                ...state,
                pfDataUpdateLists: [],
                loading: true
            }
        case PF_DATA_FOR_UPDATE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                pfDataUpdateLists: action.payload
            }
        case PF_DATA_FOR_UPDATE_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
};


export default pfDetailsByIdReducer;