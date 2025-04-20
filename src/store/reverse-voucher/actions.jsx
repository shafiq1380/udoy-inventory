import {
    ADD_REVERSE_VOUCHER_ENTRY,
    ADD_REVERSE_VOUCHER_ENTRY_SUCCESS,
    ADD_REVERSE_VOUCHER_ENTRY_FAIL,
    ADD_UNPOST_VOUCHER_ENTRY,
    ADD_UNPOST_VOUCHER_ENTRY_SUCCESS,
    ADD_UNPOST_VOUCHER_ENTRY_FAIL
} from './actionTypes';

export const addReverseVoucherEntryForm = (value) => ({
    type: ADD_REVERSE_VOUCHER_ENTRY,
    payload: value
});

export const addReverseVoucherEntrySuccess = success => ({
    type: ADD_REVERSE_VOUCHER_ENTRY_SUCCESS,
    payload: success
});

export const addReverseVoucherEntryFail = error => ({
    type: ADD_REVERSE_VOUCHER_ENTRY_FAIL,
    payload: error
});


export const addUnpostVoucherEntryForm = (value) => ({
    type: ADD_UNPOST_VOUCHER_ENTRY,
    payload: value
});

export const addUnpostVoucherEntrySuccess = success => ({
    type: ADD_UNPOST_VOUCHER_ENTRY_SUCCESS,
    payload: success
});

export const addUnpostVoucherEntryFail = error => ({
    type: ADD_UNPOST_VOUCHER_ENTRY_FAIL,
    payload: error
});