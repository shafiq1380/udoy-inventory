import { ADD_REVISE_VOUCHER_UPLOAD, ADD_REVISE_VOUCHER_UPLOAD_SUCCESS, ADD_REVISE_VOUCHER_UPLOAD_FAIL } from './actionTypes';

const initialState = {
    loading: false,
    error: null,
    success: null,
};


const reviseVoucherUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REVISE_VOUCHER_UPLOAD:
            return {
                ...state,
                loading: false,
                error: null,
            };
        case ADD_REVISE_VOUCHER_UPLOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload,
            };
        case ADD_REVISE_VOUCHER_UPLOAD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: null,
            };
        default:
            return state;
    }
}

export default reviseVoucherUploadReducer;