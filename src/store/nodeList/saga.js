import { put, takeEvery, takeLatest } from 'redux-saga/effects';

import { Post } from '../../utils/https';
import { GET_NODE_LIST } from './actionTypes';
import { getNodeListSuccess } from './actions';


// Replace 'fetchUsersApi' with your actual API call function
function* getNodeList(data) {
  // console.log('data', data)
  try {
    const response = yield Post('/api/UserManagement/GetNodeListByUser', data.payload);
    // console.log(response)
    if (response.data.success === true) {
      yield put(getNodeListSuccess(response.data.data));
      localStorage.setItem('nodeList', JSON.stringify(response.data.data));
      // console.log('Menu', response)
    }
    // yield put(fetchUsersSuccess(response.data.data));
  } catch (error) {
    yield put(fetchUsersFailure(error));
  }
}



function* nodeList() {
  yield takeEvery(GET_NODE_LIST, getNodeList);

}

export default nodeList;