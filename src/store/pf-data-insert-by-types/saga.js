import { put, takeLatest } from 'redux-saga/effects';

import { GET_PF_DATA_INSERT_BY_TYPE_REQUEST, getPFDataInsertByTypeSuccess, getPFDataInsertByTypeFailure } from './actions';
import { Post } from '../../utils/https';


function* getPFDataInsertByType(type) {
    const data = {
        data: type.payload
    }
    // console.log("getPFDataInsertByType data ----------->>> ", data);
    try {
        const response = yield Post('/api/ProvidentFund/GetGPFDataforInsertByType', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(getPFDataInsertByTypeSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(getPFDataInsertByTypeFailure(error))
    }
};


function* getPFDataInsertByTypeSaga() {
    yield takeLatest(GET_PF_DATA_INSERT_BY_TYPE_REQUEST, getPFDataInsertByType);
};

export default getPFDataInsertByTypeSaga;