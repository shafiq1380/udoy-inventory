import { ADD_REVISE_VOUCHER_ENTRY, ADD_REVISE_VOUCHER_ENTRY_SUCCESS, ADD_REVISE_VOUCHER_ENTRY_FAIL } from './actionTypes';

export const addReviseVoucherEntryForm = (value) => ({
    type: ADD_REVISE_VOUCHER_ENTRY,
    payload: value
});

export const addReviseVoucherEntrySuccess = success => ({
    type: ADD_REVISE_VOUCHER_ENTRY_SUCCESS,
    payload: success
});

export const addReviseVoucherEntryFail = error => ({
    type: ADD_REVISE_VOUCHER_ENTRY_FAIL,
    payload: error
});