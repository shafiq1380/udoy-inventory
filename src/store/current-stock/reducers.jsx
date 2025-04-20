import { error, success } from 'toastr';
import {
    GET_CURRENT_STOCK_REQUEST,
    GET_CURRENT_STOCK_SUCCESS,
    GET_CURRENT_STOCK_FAILURE,
    POST_TRANSACTION,
    DELETE_TRANSACTION,
    TRANSACTION_FAILER,
    TRANSACTION_SUCCESS,
} from './actions';

const initialState = {
    currentStock: null,
    loading: false,
    error: null,
    success: {}
};

const currentStockReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CURRENT_STOCK_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                currentStock: null,
            };
        case GET_CURRENT_STOCK_SUCCESS:
            return {
                ...state,
                loading: false,
                currentStock: action.payload,
            };
        case GET_CURRENT_STOCK_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case POST_TRANSACTION:
            return {
                ...state,
                loading: true,
            };
        case DELETE_TRANSACTION:
            return {
                ...state,
                loading: true,
            };

        case TRANSACTION_FAILER:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case TRANSACTION_SUCCESS:
            // console.log(action.payload, "anup")
            return {
                ...state,
                loading: false,
                success: action.payload

            };

        default:
            return state;
    }
};

export default currentStockReducer;
