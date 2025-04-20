import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { FETCH_ALLITEMLSIT, FETCH_ALLITMGROUP, FETCH_ALLITM_SUBGROUP, FETCH_CATEGORY, FETCH_UOM, fetchAllGroupSuccess, fetchAllItemListSuccess, fetchCategorySuccess, fetchSubGroupSuccess, fetchUomSuccess } from './actions';
import { FilePost, Post } from '../../utils/https';
import axios from 'axios';


// Replace 'fetchUsersApi' with your actual API call function
function* fetchAllInvenList() {
    try {
        const response = yield Post('/api/Product/GetAllItemList', null,)
        yield put(fetchAllItemListSuccess(response.data.data));
    } catch (error) {
        // yield put(fetchUsersFailure(error));
    }
}

function* fetchAllInvenGroup() {
    try {
        const response = yield Post('/api/Product/GetAllItemGroup', null,)
        yield put(fetchAllGroupSuccess(response.data.data));
    } catch (error) {
        // yield put(fetchUsersFailure(error));
    }
}

function* fetchSubGroup(value) {
    const data = {
        "data": value.payload
    }
    try {
        const response = yield Post('/api/Product/GetItemSubGroupByGroupID', data,)
        yield put(fetchSubGroupSuccess(response.data.data));

    } catch (error) {
        // yield put(fetchUsersFailure(error));
    }
}

function* fetchCategory() {
    try {
        // const response = yield axios.post('https://smartdemo.udoyadn.com/api/Product/GetAllItemCategory', null, { headers: { 'cCode': 'DEV' } })
        const response = yield Post('/api/Product/GetAllItemCategory', null)
        yield put(fetchCategorySuccess(response.data.data));

    } catch (error) {
        // yield put(fetchUsersFailure(error));
    }
}


function* fetchUom() {
    try {
        const response = yield Post('/api/Product/GetAllItemUom', null)
        yield put(fetchUomSuccess(response.data.data));

    } catch (error) {
        // yield put(fetchUsersFailure(error));
    }
}



function* inventorySaga() {
    yield takeEvery(FETCH_ALLITEMLSIT, fetchAllInvenList);
    yield takeEvery(FETCH_ALLITMGROUP, fetchAllInvenGroup);
    yield takeEvery(FETCH_ALLITM_SUBGROUP, fetchSubGroup);
    yield takeEvery(FETCH_CATEGORY, fetchCategory);
    yield takeEvery(FETCH_UOM, fetchUom);
}

export default inventorySaga;