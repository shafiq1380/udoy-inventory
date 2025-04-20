import { ADD_REVISE_VOUCHER_ENTRY, ADD_REVISE_VOUCHER_ENTRY_SUCCESS, ADD_REVISE_VOUCHER_ENTRY_FAIL } from './actionTypes';

const initialState = {
    loading: false,
    error: null,
    success: null,
};


const reviseVoucherEntryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REVISE_VOUCHER_ENTRY:
            return {
                ...state,
                loading: false,
                error: null,
            };
        case ADD_REVISE_VOUCHER_ENTRY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload,
            };
        case ADD_REVISE_VOUCHER_ENTRY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: null,
            };
        default:
            return state;
    }
};

export default reviseVoucherEntryReducer;