import {
    ADD_VOUCHER_ENTRY_FORM,
    ADD_VOUCHER_ENTRY_SUCCESS,
    ADD_VOUCHER_ENTRY_FAIL,
    GET_SAVED_VOUCHER_LIST,

    GET_VOUCHER_BY_ID,
    GET_VOUCHER_BY_ID_SUCCESS,
    GET_VOUCHER_BY_ID_FAIL,

    POST_VOUCHER_ENTRY,
    DELETE_VOUCHER_ENTRY,
    REVIEW_VOUCHER

} from "./actionType";

const initialState = {
    loading: false,
    error: null,

    // success: null,
    saveVoucherEntry: [],
    getVoucherInfoById: {},

    success: {},
    reload: false,
    saveVoucherEntry: []

};

const voucherEntryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_VOUCHER_ENTRY_FORM:
            return state;

        case ADD_VOUCHER_ENTRY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                success: action.payload,
                reload: !state.reload
            };
        case ADD_VOUCHER_ENTRY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: null,
            };

        case GET_SAVED_VOUCHER_LIST:
            return {
                ...state,
                saveVoucherEntry: action.payload
            }

        case GET_VOUCHER_BY_ID:
            return {
                ...state,
                loading: true,
                error: null,
            }

        case GET_VOUCHER_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                getVoucherInfoById: action.payload
            }
        case GET_VOUCHER_BY_ID_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        case POST_VOUCHER_ENTRY:
            return {
                ...state,
                loading: true
            }
        case DELETE_VOUCHER_ENTRY:
            return {
                ...state,
                loading: true
            }
        case REVIEW_VOUCHER:
            return {
                ...state,
                loading: true
            }

        default:
            return state;
    }
};

export default voucherEntryReducer;