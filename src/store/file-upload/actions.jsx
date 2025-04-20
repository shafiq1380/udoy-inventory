import { FILE_UPLOAD_REQUEST, FILE_UPLOAD_SUCCESS, FILE_UPLOAD_FAIL } from './actionTypes.jsx'

export const fileUploadRequest = (value) => ({
    type: FILE_UPLOAD_REQUEST,
    payload: value,
});

export const fileUploadSuccess = success => ({
    type: FILE_UPLOAD_SUCCESS,
    payload: success,
});

export const fileUploadFail = error => ({
    type: FILE_UPLOAD_FAIL,
    payload: error,
});