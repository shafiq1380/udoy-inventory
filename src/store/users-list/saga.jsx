import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
    FETCH_USERS_REQUEST,
    fetchUsersSuccess,
    fetchUsersFailure,
    UPDATE_USER,
    ADD_USER,
    addFailer,
    addSuccess,
    ADDED_USERROLE,
    UPDATE_PASSWORD,
    USER_PHOTO_UPLOAD,
    UPDATE_USER_STATUS,
} from './actions';
import { FilePost, Post } from '../../utils/https';


// Replace 'fetchUsersApi' with your actual API call function
function* fetchUsersSaga(value) {
    const data = {
        data: value.payload
    }
    // console.log("data -------------", data)
    try {
        const response = yield Post('/api/UserManagement/GetAllLoginInformation', data);
        // console.log("response  ---------->>>>>>> ", response);
        yield put(fetchUsersSuccess(response.data.data));
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}

function* updateUser(user) {
    const data = {
        data: user.payload
    }

    try {
        const response = yield Post('/api/UserManagement/UpdateLoginInformation', data);
        // console.log("response  ---------->>>>>>> ", response);
        // yield put(fetchUsersSuccess(response.data.data));
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}


function* addUser(user) {
    const data = {
        data: user.payload
    }
    try {
        const response = yield Post('/api/UserManagement/AddLoginInformation', data);
        if (response.data.success === false) {
            // console.log(response.data.errorMessage)
            yield put(addFailer(response.data.errorMessage));
        } else {
            yield put(addSuccess());
        }
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}


function* addUserRole(userRole) {
    const data = userRole.payload
    try {
        const response = yield Post('/api/UserManagement/UpdateRoleListByUser', data);
        if (response.data.success === false) {
            // console.log(response.data.errorMessage)
            yield put(addFailer(response.data.errorMessage));
        } else {
            yield put(addSuccess());
        }
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}

function* updatePassword(password) {
    const data = password.payload
    try {
        const response = yield Post('/api/UserManagement/UpdatePasswordByAdmin', data);
        if (response.data.success === false) {
            // console.log(response.data.errorMessage)
            yield put(addFailer(response.data.errorMessage));
        } else {
            yield put(addSuccess());
        }
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}

function* uploadPhoto(img) {
    const file = img.payload
    // console.log('User ID', file.get('UserID'))
    // console.log('User Photo ', file.get('UserPhoto'))
    try {
        const response = yield FilePost('/api/UserManagement/UpdateLoginPhoto', file);
        // console.log(response)
        if (response.data.success === false) {
            // console.log(response.data.errorMessage)
            yield put(addFailer(response.data.errorMessage));
        } else {
            yield put(addSuccess());
        }
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}

function* updateUserStatus(data) {
    const statusData = data.payload
    try {
        const response = yield Post('/api/UserManagement/UpdateLoginStatus', statusData);
        if (response.data.success === false) {
            yield put(addFailer(response.data.errorMessage));
        } else {
            yield put(addSuccess());
        }
    } catch (error) {
        yield put(fetchUsersFailure(error));
    }
}

function* usersSaga() {
    yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
    yield takeEvery(UPDATE_USER, updateUser);
    yield takeEvery(ADD_USER, addUser);
    yield takeEvery(ADDED_USERROLE, addUserRole);
    yield takeEvery(UPDATE_PASSWORD, updatePassword);
    yield takeEvery(USER_PHOTO_UPLOAD, uploadPhoto);
    yield takeEvery(UPDATE_USER_STATUS, updateUserStatus);
}

export default usersSaga;