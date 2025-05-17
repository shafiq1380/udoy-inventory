// saga.js
import { put, takeEvery } from 'redux-saga/effects';
import { VOUCHER_UPDATE } from './actionType';
import { Post } from "../../utils/https";
import { updateVoucherFail, updateVoucherSuccess } from "./actions";


function* updateVoucherEntry(data) {
    // console.log("Data from saga --------->>>>", data);
    try {
        const voucherUpdate = yield Post('/api/v1/VoucherEntry/UpdateVoucher', data.payload)
        // console.log("voucherUpdate ------->>>>", voucherUpdate);
        if (voucherUpdate?.data.success === false) {
            yield put(updateVoucherFail(voucherUpdate.data.errorMessage))
        } else {
            yield put(updateVoucherSuccess(voucherUpdate.data))
        }
    } catch (error) {
        yield put(updateVoucherFail(error))
    }
};


function* voucherUpdateSaga() {
    yield takeEvery(VOUCHER_UPDATE, updateVoucherEntry);

}

export default voucherUpdateSaga;