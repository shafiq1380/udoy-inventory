// reducers.js
import { VOUCHER_UPDATE, VOUCHER_UPDATE_SUCCESS, VOUCHER_UPDATE_FAILURE } from './actionType';

const initialState = {
    loading: false,
    error: null,
    success: null,
};

const voucherUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
        case VOUCHER_UPDATE:
            return state;
        case VOUCHER_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload
            };
        case VOUCHER_UPDATE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: null
            };
        default:
            return state;
    }
};

export default voucherUpdateReducer;
