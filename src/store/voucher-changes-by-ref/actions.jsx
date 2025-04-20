import { GET_VOUCHER_CHANGES_BY_REF_REQUEST, GET_VOUCHER_CHANGES_BY_REF_SUCCESS, GET_VOUCHER_CHANGES_BY_REF_FAIL } from "./actionTypes";

export const getVoucherChangesByRef = (value) => ({
    type: GET_VOUCHER_CHANGES_BY_REF_REQUEST,
    payload: value
});

export const getVoucherChangesByRefSuccess = success => ({
    type: GET_VOUCHER_CHANGES_BY_REF_SUCCESS,
    payload: success
});

export const getVoucherChangesByRefFail = error => ({
    type: GET_VOUCHER_CHANGES_BY_REF_FAIL,
    payload: error
});