import { VOUCHER_UPDATE, VOUCHER_UPDATE_SUCCESS, VOUCHER_UPDATE_FAILURE } from './actionType';

export const updateVoucher = (value) => ({
    type: VOUCHER_UPDATE,
    payload: value,
});

export const updateVoucherSuccess = success => ({
    type: VOUCHER_UPDATE_SUCCESS,
    payload: success
});

export const updateVoucherFail = error => ({
    type: VOUCHER_UPDATE_FAILURE,
    payload: error
});