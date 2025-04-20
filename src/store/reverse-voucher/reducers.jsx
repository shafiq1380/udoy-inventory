import {
    ADD_REVERSE_VOUCHER_ENTRY,
    ADD_REVERSE_VOUCHER_ENTRY_SUCCESS,
    ADD_REVERSE_VOUCHER_ENTRY_FAIL,
    ADD_UNPOST_VOUCHER_ENTRY,
    ADD_UNPOST_VOUCHER_ENTRY_SUCCESS,
    ADD_UNPOST_VOUCHER_ENTRY_FAIL
} from './actionTypes';

const initialState = {
    loading: false,
    error: null,
    success: {},
    unpostSuccess: {}
};


const reverseVoucherEntryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REVERSE_VOUCHER_ENTRY:
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload,
            };
        case ADD_REVERSE_VOUCHER_ENTRY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload,
            };
        case ADD_REVERSE_VOUCHER_ENTRY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: {},
            };

        case ADD_UNPOST_VOUCHER_ENTRY:
            return {
                ...state,
                loading: false,
                error: null,
                unpostSuccess: action.payload,
            };

        case ADD_UNPOST_VOUCHER_ENTRY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                unpostSuccess: action.payload,
            };

        case ADD_UNPOST_VOUCHER_ENTRY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                unpostSuccess: {},
            };
        default:
            return state;
    }
};

export default reverseVoucherEntryReducer;