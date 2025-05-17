import { put, takeLatest } from 'redux-saga/effects';

import {
    FETCH_PF_DETAILS_BY_ID_REQUEST,
    fetchPFDetailsByIdSuccess,
    fetchPFDetailsByIdFailure,
    PF_DATA_FOR_UPDATE_BY_ID_REQUEST,
    pfDataForUpdateByIdSuccess,
    pfDataForUpdateByIdFailure
} from './actions';
import { Post } from '../../utils/https';


function* fetchPFDetailsById(type) {
    const data = {
        data: type.payload
    };
    // console.log("fetchPFDetailsById data ----------->>> ", data);
    try {
        const response = yield Post('/api/v1/ProvidentFund/GetGPFDataDetailViewByID', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(fetchPFDetailsByIdSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(fetchPFDetailsByIdFailure(error))
    }
};


function* pfDataForUpdateById(type) {
    const data = {
        data: type.payload
    };
    // console.log("fetchPFDetailsById data ----------->>> ", data);
    try {
        const response = yield Post('/api/v1/ProvidentFund/GetGPFDataforUpdateByID', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(pfDataForUpdateByIdSuccess(response.data.data));
    } catch (error) {
        console.log("error  ---------->>>>>>> ", error);
        yield put(pfDataForUpdateByIdFailure(error))
    }
};


function* fetchPFDetailsByIdSaga() {
    yield takeLatest(FETCH_PF_DETAILS_BY_ID_REQUEST, fetchPFDetailsById);
    yield takeLatest(PF_DATA_FOR_UPDATE_BY_ID_REQUEST, pfDataForUpdateById);
};

export default fetchPFDetailsByIdSaga;