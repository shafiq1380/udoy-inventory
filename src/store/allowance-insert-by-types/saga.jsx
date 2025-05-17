import { put, takeLatest } from 'redux-saga/effects';

import { FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST, fetchAllowanceDataForInsertByTypeSuccess, fetchAllowanceDataForInsertByTypeFailure } from './actions';
import { Post } from '../../utils/https';


function* fetchAllowanceDataForInsertByType(type) {
    const data = {
        data: type.payload
    }
    // console.log("fetchAllowanceListsByType data ----------->>> ", data);
    try {
        const response = yield Post('/api/v1/Payroll/GetAllowanceDataforInsertByType', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(fetchAllowanceDataForInsertByTypeSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(fetchAllowanceDataForInsertByTypeFailure(error))
    }
};


function* fetchAllowanceDataForInsertByTypeSaga() {
    yield takeLatest(FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST, fetchAllowanceDataForInsertByType);
};

export default fetchAllowanceDataForInsertByTypeSaga;