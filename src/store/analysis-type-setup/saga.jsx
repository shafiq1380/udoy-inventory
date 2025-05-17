import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
    FETCH_ANAL_TYPE_REQUEST,
    fetchAnalTypeSuccess,
    fetchAnalTypeFailure,
    UPDATE_ANAL_TYPE,
    ADD_ANAL_TYPE,
    updateAnalTypeSuccess,
} from './actions';
import { Post } from '../../utils/https';


// Replace 'fetchUsersApi' with your actual API call function
function* fetchAnaltypeSaga() {


    try {
        const response = yield Post('/api/v1/CoaSetup/GetAllAnalysisType');
        // console.log("response  ---------->>>>>>> ", response);
        if (response.data.success === true) {
            yield put(fetchAnalTypeSuccess(response.data.data));
        } else if (response.data.success === false) {
            yield put(fetchAnalTypeFailure(response.data.errorMessage))
        }

    } catch (error) {
        yield put(fetchAnalTypeFailure(error));
    }
}

function* updateAnalType(anals) {
    const data = {
        data: anals.payload
    }

    try {
        const response = yield Post('/api/v1/dCoaSetup/UpdateAnalysisType', data);
        if (response.data.success === true) {
            yield put(updateAnalTypeSuccess());
        } else if (response.data.success === false) {
            yield put(fetchAnalTypeFailure(response.data.errorMessage))
        }
    } catch (error) {
        yield put(fetchAnalTypeFailure(error));
    }
}


function* addAnalType(anals) {
    //console.log('New User Information', anals.payload)
    const data = {
        data: anals.payload
    }
    try {
        const response = yield Post('/api/v1/CoaSetup/AddAnalysisType', data);
        if (response.data.success === true) {
            yield put(updateAnalTypeSuccess());
        } else if (response.data.success === false) {
            yield put(fetchAnalTypeFailure(response.data.errorMessage))
        }
    } catch (error) {
        yield put(fetchAnalTypeFailure(error));
    }
}



function* analtypeSaga() {
    yield takeLatest(FETCH_ANAL_TYPE_REQUEST, fetchAnaltypeSaga);
    yield takeEvery(UPDATE_ANAL_TYPE, updateAnalType);
    yield takeEvery(ADD_ANAL_TYPE, addAnalType);
}

export default analtypeSaga;