import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https";
import { addReviseVoucherUploadSuccess, addReviseVoucherUploadFail } from './actions';
import { ADD_REVISE_VOUCHER_UPLOAD } from './actionTypes';

function* reviseVoucherUpload(data) {
    // console.log("Data from saga revise --------->>>>", data.payload);
    try {
        const reviseVoucher = yield Post('/api/v1/VoucherEntry/ReviseVoucher', data.payload)
        // console.log("reviseVoucher response ------->>>>", reviseVoucher);
        if (reviseVoucher.data.success === true) {
            yield put(addReviseVoucherUploadSuccess(reviseVoucher.data.data))
        } else {
            yield put(addReviseVoucherUploadFail(reviseVoucher.data.errorMessage))
        }
    } catch (error) {
        console.log(error)
    }
};

function* reviseVoucherUploadSaga() {
    yield takeEvery(ADD_REVISE_VOUCHER_UPLOAD, reviseVoucherUpload);
}

export default reviseVoucherUploadSaga;