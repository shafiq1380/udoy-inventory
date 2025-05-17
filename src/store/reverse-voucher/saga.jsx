import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https";
import {
    addReverseVoucherEntrySuccess,
    addReverseVoucherEntryFail,
    addUnpostVoucherEntrySuccess,
    addUnpostVoucherEntryFail
} from './actions';

import { ADD_REVERSE_VOUCHER_ENTRY, ADD_UNPOST_VOUCHER_ENTRY } from './actionTypes';


function* reverseVoucherEntry(data) {
    // console.log("Data from saga reverse --------->>>>", data.payload);
    try {
        const reverseVoucher = yield Post('/api/v1/VoucherEntry/ReverseVoucher', data.payload)
        // console.log("reverseVoucher response ------->>>>", reverseVoucher);
        if (reverseVoucher.data.success === false) {
            yield put(addReverseVoucherEntryFail(reverseVoucher.data.errorMessage))
        } else {
            yield put(addReverseVoucherEntrySuccess(reverseVoucher.data.data))
        }
    } catch (error) {
        console.log(error)
    }
};


function* unpostVoucherEntry(data) {
    // console.log("Data from saga unpost --------->>>>", data.payload);
    try {
        const unpostVoucher = yield Post('/api/v1/VoucherEntry/UnpostVoucher', data.payload)
        console.log("unpostVoucher response ------->>>>", unpostVoucher);
        if (unpostVoucher.data.success === false) {
            yield put(addUnpostVoucherEntryFail(unpostVoucher.data.errorMessage))
        } else {
            yield put(addUnpostVoucherEntrySuccess(unpostVoucher.data.data))
        }
    } catch (error) {
        console.log(error)
    }
};

function* reverseVoucherEntrySaga() {
    yield takeEvery(ADD_REVERSE_VOUCHER_ENTRY, reverseVoucherEntry);
    yield takeEvery(ADD_UNPOST_VOUCHER_ENTRY, unpostVoucherEntry);
}

export default reverseVoucherEntrySaga;