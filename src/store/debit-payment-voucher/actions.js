import {
    ADD_VOUCHER_ENTRY_FORM,
    ADD_VOUCHER_ENTRY_SUCCESS,
    ADD_VOUCHER_ENTRY_FAIL,
    GET_SAVED_VOUCHER_LIST,

    GET_VOUCHER_BY_ID,
    GET_VOUCHER_BY_ID_SUCCESS,
    GET_VOUCHER_BY_ID_FAIL,

    DELETE_VOUCHER_ENTRY,
    POST_VOUCHER_ENTRY,
    REVIEW_VOUCHER

} from "./actionType";

export const addVoucherEntryForm = (value) => ({
    type: ADD_VOUCHER_ENTRY_FORM,
    payload: value
});

export const addVoucherEntrySuccess = success => ({
    type: ADD_VOUCHER_ENTRY_SUCCESS,
    payload: success
});

export const addVoucherEntryFail = error => ({
    type: ADD_VOUCHER_ENTRY_FAIL,
    payload: error
});


export const saveVoucherList = data => ({
    type: GET_SAVED_VOUCHER_LIST,
    payload: data

});

export const getVoucherById = (data) => ({
    type: GET_VOUCHER_BY_ID,
    payload: data
});

export const getVoucherByIdSuccess = (data) => ({
    type: GET_VOUCHER_BY_ID_SUCCESS,
    payload: data
});

export const getVoucherByIdFail = (data) => ({
    type: GET_VOUCHER_BY_ID_FAIL,
    payload: data
});


export const postVoucher = (data) => ({
    type: POST_VOUCHER_ENTRY,
    payload: data
})

export const deleteVoucher = (data) => ({
    type: DELETE_VOUCHER_ENTRY,
    payload: data
})
export const reviewVoucher = (data) => ({
    type: REVIEW_VOUCHER,
    payload: data
})

