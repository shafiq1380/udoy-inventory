export const FETCH_ANAL_TYPE_REQUEST = 'FETCH_ANAL_TYPE_REQUEST';
export const FETCH_ANAL_TYPE_SUCCESS = 'FETCH_ANAL_TYPE_SUCCESS';
export const FETCH_ANAL_TYPE_FAILURE = 'FETCH_ANAL_TYPE_FAILURE';

export const UPDATE_ANAL_TYPE = 'UPDATE_ANAL_TYPE';
export const UPDATE_ANAL_TYPE_SUCCESS = 'UPDATE_ANAL_TYPE_SUCCESS';
export const ADD_ANAL_TYPE = 'ADD_ANAL_TYPE';

export const fetchAnalTypeRequest = (value) => ({
    type: FETCH_ANAL_TYPE_REQUEST,
    payload: value,
});

export const fetchAnalTypeSuccess = analtype => ({
    type: FETCH_ANAL_TYPE_SUCCESS,
    payload: analtype,
});

export const fetchAnalTypeFailure = error => ({
    type: FETCH_ANAL_TYPE_FAILURE,
    payload: error,
});

export const updateAnalType = analtype => ({
    type: UPDATE_ANAL_TYPE,
    payload: analtype
})

export const updateAnalTypeSuccess = analtype => ({
    type: UPDATE_ANAL_TYPE_SUCCESS,
});

export const addAnalType = analtype => ({
    type: ADD_ANAL_TYPE,
    payload: analtype
})