export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const UPDATE_USER = 'UPDATE_USER';

export const ADD_USER = 'ADD_USER';
export const ADDED_FAILER = 'ADDED_FAILER'
export const ADDED_SUCCESS = 'ADDED_SUCCESS'

export const ADDED_USERROLE = 'ADDED_USERROLE'

export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'

export const USER_PHOTO_UPLOAD = 'USER_PHOTO_UPLOAD'

export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS'

export const fetchUsersRequest = (value) => ({
    type: FETCH_USERS_REQUEST,
    payload: value,
});

export const fetchUsersSuccess = users => ({
    type: FETCH_USERS_SUCCESS,
    payload: users,
});

export const fetchUsersFailure = error => ({
    type: FETCH_USERS_FAILURE,
    payload: error,
});

export const updateUser = user => ({
    type: UPDATE_USER,
    payload: user
})

export const addUser = user => ({
    type: ADD_USER,
    payload: user
})

export const addFailer = data => ({
    type: ADDED_FAILER,
    payload: data
})
export const addSuccess = data => ({
    type: ADDED_SUCCESS,
})

export const addUserRole = data => ({
    type: ADDED_USERROLE,
    payload: data
})

export const updatePassword = data => ({
    type: UPDATE_PASSWORD,
    payload: data
})

export const uploadPhoto = data => ({
    type: USER_PHOTO_UPLOAD,
    payload: data
})

export const updateUserStatus = data => ({
    type: UPDATE_USER_STATUS,
    payload: data
})