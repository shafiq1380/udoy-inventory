import { put, takeLatest } from 'redux-saga/effects';

import {
    FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST,
    fetchAllowanceDetailsByIdSuccess,
    fetchAllowanceDetailsByIdFailure,
    FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST,
    fetchAllowanceDataForUpdateByIdSuccess,
    fetchAllowanceDataForUpdateByIdFailure
} from './actions';
import { Post } from '../../utils/https';


function* fetchAllowanceDetailsById(type) {
    const data = {
        data: type.payload
    }

    // console.log("fetchAllowanceListsByType data ----------->>> ", data);

    try {
        const response = yield Post('/api/Payroll/GetAllowanceDetailViewByID', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(fetchAllowanceDetailsByIdSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(fetchAllowanceDetailsByIdFailure(error))
    }

};



function* fetchAllowanceDataForUpdateById(type) {
    const data = {
        data: type.payload
    }

    // console.log("fetchAllowanceDataForUpdateById data ----------->>> ", data);

    try {
        const response = yield Post('/api/Payroll/GetAllowanceDataforUpdateByID', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(fetchAllowanceDataForUpdateByIdSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(fetchAllowanceDataForUpdateByIdFailure(error))
    }
};


function* fetchAllowanceDetailsByIdSaga() {
    yield takeLatest(FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST, fetchAllowanceDetailsById);
    yield takeLatest(FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST, fetchAllowanceDataForUpdateById);
};

export default fetchAllowanceDetailsByIdSaga;