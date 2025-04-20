import { put, takeEvery, } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, logoutUserSuccess } from "./actions";

import { LoginPost, Post } from "../../../utils/https";
import { toast } from "react-toastify";


function* loginUser({ payload: { user, history } }) {

  try {
    // localStorage.setItem('userID', JSON.stringify(user.data.userID.trim()))

    // localStorage.setItem('cCode', JSON.stringify(user.data.cCode))

    // //added module in local storage
    // localStorage.setItem('module', JSON.stringify(3))
    // sessionStorage.setItem('module', JSON.stringify(3));

    // console.log("user action before", user);
    // console.log('clgstart')
    const getToken = yield LoginPost('/api/Auth/GetAuthToken', user);

    // console.log("user action after", user);

    console.log('response', getToken)

    const authTimestamp = new Date().getTime(); // for get local pc time
    localStorage.setItem('authUser', JSON.stringify(getToken.data.token))
    // localStorage.setItem('authKey', JSON.stringify(getToken.data.data.key))
    // localStorage.setItem('cName', JSON.stringify(getToken.data.data.cName))
    localStorage.setItem("authTimestamp", authTimestamp.toString()); // set local pc time

    if (getToken.status === 200) {
      history('/landingPage');
    }

    if (getToken.data.success === false) {
      yield put(apiError(getToken.data.errorMessage));
      toast.error((getToken.data.errorMessage));
    }

  } catch (error) {
    // yield put(fetchDataFailure(error));
  }
}
function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem('userID');
    localStorage.removeItem("authTimestamp");
    localStorage.removeItem("cCode");
    localStorage.removeItem("cName");
    localStorage.removeItem("authKey");
    localStorage.removeItem("_grecaptcha");
    localStorage.removeItem("nodeList")
    localStorage.removeItem("module")
    sessionStorage.removeItem("module");
    localStorage.removeItem('selectItem')
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}



function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
