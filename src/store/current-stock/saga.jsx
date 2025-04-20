import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { GET_CURRENT_STOCK_REQUEST, getCurrentStockSuccess, getCurrentStockFailure, POST_TRANSACTION, failedTransaction, successTransaction, DELETE_TRANSACTION } from './actions';
import { Post } from '../../utils/https';

function* fetchCurrentStock(value) {
    // console.log('anup', value.payload)
    const data = {
        data: {
            itemID: value.payload.itemID,
            storeID: value.payload.storeID
        }
    }

    try {
        const response = yield Post('/api/InvTransaction/GetCurrentStockQuantity', data)
        // console.log("response from server", response.data.data)

        if (response.status == 200) {
            yield put(getCurrentStockSuccess(response.data));
        } else {
            yield put(getCurrentStockFailure(response.data.errorMessage));
        }

    } catch (error) {
        console.log("fetch current stock failure", error)
    }
};


function* postTransaction(value) {
    const data = {
        data: value.payload
    }
    console.log(value.payload)
    try {
        const response = yield Post('/api/InvTransaction/PostInvTransaction', data)
        // console.log("response from server", response)
        if (response.data.success === false) {
            yield put(failedTransaction(response.data.errorMessage))
        } else {
            yield put(successTransaction(response.data.data))
        }
    } catch (error) {
        console.log("fetch current stock failure", error)
    }
};


function* deleteTransaction(value) {
    const data = {
        data: value.payload
    }
    try {

        const response = yield Post('/api/InvTransaction/DeleteInvTransaction', data)
        console.log("response from server", response.data)
        if (response.data.success === false) {
            yield put(failedTransaction(response.data.errorMessage))
        } else {
            yield put(successTransaction())
        }
    } catch (error) {
        console.log("fetch current stock failure", error)
    }
};


function* watchFetchCurrentStock() {
    yield takeLatest(GET_CURRENT_STOCK_REQUEST, fetchCurrentStock);
    yield takeEvery(POST_TRANSACTION, postTransaction);
    yield takeLatest(DELETE_TRANSACTION, deleteTransaction);
};

export default watchFetchCurrentStock;

