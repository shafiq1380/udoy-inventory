import { GET_PF_TRANSACTION_REQUEST, GET_PF_TRANSACTION_SUCCESS, GET_PF_TRANSACTION_FAILED } from "./actions";

const initialState = {
    loading: false,
    pfTransactionByType: [],
    error: null
};

const pfTransactionByTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PF_TRANSACTION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_PF_TRANSACTION_SUCCESS:
            return {
                ...state,
                loading: false,
                pfTransactionByType: action.payload
            }
        case GET_PF_TRANSACTION_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
};


export default pfTransactionByTypeReducer;