export const FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST = 'FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST';
export const FETCH_ALLOWANCE_DETAILS_BY_ID_SUCCESS = 'FETCH_ALLOWANCE_DETAILS_BY_ID_SUCCESS';
export const FETCH_ALLOWANCE_DETAILS_BY_ID_FAILURE = 'FETCH_ALLOWANCE_DETAILS_BY_ID_FAILURE';

export const FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST = 'FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST';
export const FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_SUCCESS = 'FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_SUCCESS';
export const FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_FAILURE = 'FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_FAILURE';

export const fetchAllowanceDetailsByIdRequest = (value) => ({
    type: FETCH_ALLOWANCE_DETAILS_BY_ID_REQUEST,
    payload: value,
});

export const fetchAllowanceDetailsByIdSuccess = allowanceDetailsById => ({
    type: FETCH_ALLOWANCE_DETAILS_BY_ID_SUCCESS,
    payload: allowanceDetailsById,
});

export const fetchAllowanceDetailsByIdFailure = error => ({
    type: FETCH_ALLOWANCE_DETAILS_BY_ID_FAILURE,
    payload: error,
});


export const fetchAllowanceDataForUpdateByIdRequest = (value) => ({
    type: FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_REQUEST,
    payload: value,
});

export const fetchAllowanceDataForUpdateByIdSuccess = allowanceDataForUpdateById => ({
    type: FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_SUCCESS,
    payload: allowanceDataForUpdateById,
});

export const fetchAllowanceDataForUpdateByIdFailure = error => ({
    type: FETCH_ALLOWANCE_DATA_FOR_UPDATE_BY_ID_FAILURE,
    payload: error,
});