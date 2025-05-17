import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https";
import { fileUploadSuccess, fileUploadFail } from './actions';
import { FILE_UPLOAD_REQUEST } from './actionTypes';


function* fileUploadEntry(data) {
    // console.log("Data from saga revise --------->>>>", data.payload);
    try {
        const fileUpload = yield Post('/api/v1/DocumentAttachment/GetDocumentList', data.payload)
        // console.log("fileUpload response ------->>>>", fileUpload);

        if (fileUpload.data.data.userID === null) {
            yield put(fileUploadFail('No Voucher Found With This Reference:'))
        } else if (fileUpload.data.data.userID !== null) {
            yield put(fileUploadSuccess(fileUpload.data.data))
        }
    } catch (error) {
        console.log(error)
    }
};

function* fileUploadEntrySaga() {
    yield takeEvery(FILE_UPLOAD_REQUEST, fileUploadEntry);
}

export default fileUploadEntrySaga;