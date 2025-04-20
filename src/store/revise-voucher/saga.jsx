import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https";
import { addReviseVoucherEntrySuccess, addReviseVoucherEntryFail } from './actions';
import { ADD_REVISE_VOUCHER_ENTRY } from './actionTypes';


function* reviseVoucherEntry(data) {
    // console.log("Data from saga revise --------->>>>", data.payload);
    try {
        const reviseVoucher = yield Post('/api/VoucherEntry/GetVoucherByRef', data.payload)
        // console.log("reviseVoucher response ------->>>>", reviseVoucher);

        if (reviseVoucher.data.data.userID === null) {
            yield put(addReviseVoucherEntryFail('No Voucher Found With This Reference:'))
        } else if (reviseVoucher.data.data.userID !== null) {
            yield put(addReviseVoucherEntrySuccess(reviseVoucher.data.data))
        }
    } catch (error) {
        console.log(error)
    }
};

function* reviseVoucherEntrySaga() {
    yield takeEvery(ADD_REVISE_VOUCHER_ENTRY, reviseVoucherEntry);
}

export default reviseVoucherEntrySaga;