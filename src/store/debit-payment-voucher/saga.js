import { put, takeEvery } from "redux-saga/effects"

import { GET_VOUCHER_BY_ID, REVIEW_VOUCHER } from "./actionType";
import { Post } from "../../utils/https";
import { addVoucherEntryFail, addVoucherEntrySuccess, getVoucherByIdSuccess, getVoucherByIdFail } from "./actions";

import { ADD_VOUCHER_ENTRY_FORM, DELETE_VOUCHER_ENTRY, GET_SAVED_VOUCHER_LIST, POST_VOUCHER_ENTRY } from "./actionType";
import { saveVoucherList } from "./actions";

function* addVoucherEntry(data) {
    // console.log("Data from saga --------->>>>", data);
    try {
        const voucherEntry = yield Post('/api/VoucherEntry/InsertVoucher', data.payload)
        // console.log("voucherEntry ------->>>>", voucherEntry);
        if (voucherEntry?.data.success === false) {
            yield put(addVoucherEntryFail(voucherEntry.data.errorMessage))
        } else {
            // yield put(addVoucherEntrySuccess(`Voucher Created Successfully, ${voucherEntry.data.data}, ${voucherEntry.data.success}`))
            yield put(addVoucherEntrySuccess(voucherEntry.data))
        }
    } catch (error) {
        yield put(addVoucherEntryFail(error))
    }
};

// function* getAllSaveVoucherList() {
//     console.log('anup')
//     try {
//         const response = yield Post('/api/VoucherEntry/GetSavedVoucherList')
//         if (response.data.success === true) {
//             // yield put(getSaveVoucherList(response.data.data))
//             yield put(saveVoucherList(response.data.data))
//             console.log('anup Das', response)
//         }
//     } catch (error) {

//     }
//     // try {
//     //     const response = yield Post('/api/VoucherEntry/GetSavedVoucherList')
//     //     if (response.data.success === true) {
//     //         yield put(getSaveVoucherList(response.data.data))
//     //     } else {
//     //         // yield put(addVoucherEntrySuccess("Voucher entry was successful"))
//     //     }
//     // } catch (error) {

//     // }
// }

function* postVoucher(data) {
    const postData = data.payload;
    try {
        const response = yield Post('/api/VoucherEntry/PostVoucher', postData)
        if (response.data.success === false) {
            yield put(addVoucherEntryFail(response.data.errorMessage))
        } else {
            yield put(addVoucherEntrySuccess(response.data.data))
        }
    } catch (error) {

    }
};

function* getVoucherByIds(id) {

    const data = {
        data: id.payload
    }

    try {
        const response = yield Post('/api/VoucherEntry/GetVoucherByID', data)
        // console.log("voucherEntry ------->>>>", response);
        if (response?.data.success === true) {
            yield put(getVoucherByIdSuccess(response.data.data))
        } else {
            yield put(getVoucherByIdFail(response.data.data))
        }
    } catch (error) {
        console.log(error)
    }
}
function* deleteVoucher(data) {
    const deleteData = data.payload;
    try {
        const response = yield Post('/api/VoucherEntry/DeleteVoucher', deleteData)
        if (response.data.success === false) {
            yield put(addVoucherEntryFail(response.data.errorMessage))
        } else {
            yield put(addVoucherEntrySuccess({ deleteMsg: 'Delete Voucher successfully' }))
        }
    } catch (error) {

    }
}

function* reviewVoucher(data) {
    const postData = data.payload;
    try {
        const response = yield Post('/api/VoucherEntry/ReviewVoucher', postData)
        // console.log(response)
        if (response.data.success === true) {
            yield put(addVoucherEntrySuccess({ successMsg: 'Review Added successfully' }))
        } else {
            yield put(addVoucherEntryFail(response.data.errorMessage))
        }
    } catch (error) {

    }
}



function* voucherEntrySaga() {
    yield takeEvery(ADD_VOUCHER_ENTRY_FORM, addVoucherEntry);
    yield takeEvery(GET_VOUCHER_BY_ID, getVoucherByIds);
    yield takeEvery(POST_VOUCHER_ENTRY, postVoucher)
    yield takeEvery(DELETE_VOUCHER_ENTRY, deleteVoucher)
    yield takeEvery(REVIEW_VOUCHER, reviewVoucher)
    // yield takeEvery(GET_SAVED_VOUCHER_LIST, getAllSaveVoucherList);
}

export default voucherEntrySaga;