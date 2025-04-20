import { ADD_REVISE_VOUCHER_UPLOAD, ADD_REVISE_VOUCHER_UPLOAD_SUCCESS, ADD_REVISE_VOUCHER_UPLOAD_FAIL } from './actionTypes';

export const addReviseVoucherUpload = (value) => ({
    type: ADD_REVISE_VOUCHER_UPLOAD,
    payload: value
});

export const addReviseVoucherUploadSuccess = (value) => ({
    type: ADD_REVISE_VOUCHER_UPLOAD_SUCCESS,
    payload: value
});

export const addReviseVoucherUploadFail = (value) => ({
    type: ADD_REVISE_VOUCHER_UPLOAD_FAIL,
    payload: value
});