import { put, takeLatest } from 'redux-saga/effects';

import { FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST, fetchAllowanceListsByTypeSuccess, fetchAllowanceListsByTypeFailure } from './actions';
import { Post } from '../../utils/https';


function* fetchAllowanceListsByType(type) {
    const data = {
        data: type.payload
    }

    // console.log("fetchAllowanceListsByType data ----------->>> ", data);

    try {
        const response = yield Post('/api/Payroll/GetAllowanceList', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(fetchAllowanceListsByTypeSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(fetchAllowanceListsByTypeFailure(error))
    }

};


function* fetchAllowanceListsByTypeSaga() {
    yield takeLatest(FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST, fetchAllowanceListsByType);
};

export default fetchAllowanceListsByTypeSaga;