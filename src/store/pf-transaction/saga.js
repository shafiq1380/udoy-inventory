import { put, takeLatest } from 'redux-saga/effects';

import { GET_PF_TRANSACTION_REQUEST, getPFTransactionByTypeSuccess, getPFTransactionByTypeFailure } from './actions';
import { Post } from '../../utils/https';


function* getPFTransactionByType(type) {
    const data = {
        data: type.payload
    }

    // console.log("getPFTransactionByType data ----------->>> ", data);

    try {
        const response = yield Post('/api/v1/ProvidentFund/GetGPFTransactionList', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(getPFTransactionByTypeSuccess(response.data.data.reverse()));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(getPFTransactionByTypeFailure(error))
    }

};


function* getPFTransactionByTypeSaga() {
    yield takeLatest(GET_PF_TRANSACTION_REQUEST, getPFTransactionByType);
};

export default getPFTransactionByTypeSaga;