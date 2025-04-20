import { GET_VOUCHER_CHANGES_BY_REF_REQUEST, GET_VOUCHER_CHANGES_BY_REF_SUCCESS, GET_VOUCHER_CHANGES_BY_REF_FAIL } from "./actionTypes";


const initialState = {
    getChangesByRefLoading: false,
    getChangesByRefError: null,
    getChangesByRefSuccess: null
};

const getVoucherChangesByRefReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VOUCHER_CHANGES_BY_REF_REQUEST:
            return {
                ...state,
                getChangesByRefLoading: true,
            };
        case GET_VOUCHER_CHANGES_BY_REF_SUCCESS:
            return {
                ...state,
                getChangesByRefLoading: false,
                getChangesByRefError: null,
                getChangesByRefSuccess: action.payload
            };
        case GET_VOUCHER_CHANGES_BY_REF_FAIL:
            return {
                ...state,
                getChangesByRefLoading: false,
                getChangesByRefError: action.payload,
                getChangesByRefSuccess: null
            };
        default:
            return state;
    }
};

export default getVoucherChangesByRefReducer;