import { GET_PF_DATA_INSERT_BY_TYPE_REQUEST, GET_PF_DATA_INSERT_BY_TYPE_SUCCESS, GET_PF_DATA_INSERT_BY_TYPE_FAILURE } from "./actions";

const initialState = {
    loading: false,
    pfDataInsertByType: [],
    error: null
};

const pfDataInsertByTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PF_DATA_INSERT_BY_TYPE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_PF_DATA_INSERT_BY_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                pfDataInsertByType: action.payload
            }
        case GET_PF_DATA_INSERT_BY_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};


export default pfDataInsertByTypeReducer;