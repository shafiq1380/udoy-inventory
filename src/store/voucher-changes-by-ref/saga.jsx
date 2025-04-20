import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https";
import { getVoucherChangesByRefSuccess, getVoucherChangesByRefFail } from './actions';
import { GET_VOUCHER_CHANGES_BY_REF_REQUEST } from './actionTypes';


function* voucherChangesByRef(data) {
    // console.log("Data from saga changesVoucher --------->>>>", data.payload);
    try {
        const changesVoucher = yield Post('/api/VoucherEntry/GetVoucherChangesByRef', data.payload)
        // console.log("changesVoucher response ------->>>>", changesVoucher.data);

        if (changesVoucher.data.success === true && changesVoucher.data.data.length > 0) {
            yield put(getVoucherChangesByRefSuccess(changesVoucher.data.data))
        } else if (changesVoucher.data.data.length <= 0) {
            yield put(getVoucherChangesByRefFail('No Voucher Found With This Reference:'))
        }


    } catch (error) {
        console.log(error)
    }
};

function* voucherChangesByREfSaga() {
    yield takeEvery(GET_VOUCHER_CHANGES_BY_REF_REQUEST, voucherChangesByRef);
}

export default voucherChangesByREfSaga;