export const GET_PF_DATA_INSERT_BY_TYPE_REQUEST = 'GET_PF_DATA_INSERT_BY_TYPE_REQUEST';
export const GET_PF_DATA_INSERT_BY_TYPE_SUCCESS = 'GET_PF_DATA_INSERT_BY_TYPE_SUCCESS';
export const GET_PF_DATA_INSERT_BY_TYPE_FAILURE = 'GET_PF_DATA_INSERT_BY_TYPE_FAILURE';

export const getPFDataInsertByTypeRequest = (value) => ({
    type: GET_PF_DATA_INSERT_BY_TYPE_REQUEST,
    payload: value
});

export const getPFDataInsertByTypeSuccess = (pfDataInsertByType) => ({
    type: GET_PF_DATA_INSERT_BY_TYPE_SUCCESS,
    payload: pfDataInsertByType,
});


export const getPFDataInsertByTypeFailure = (error) => ({
    type: GET_PF_DATA_INSERT_BY_TYPE_FAILURE,
    payload: error,
});
