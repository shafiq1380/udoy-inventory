export const FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST = 'FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST';
export const FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_SUCCESS = 'FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_SUCCESS';
export const FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_FAILURE = 'FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_FAILURE';

export const fetchAllowanceDataForInsertByTypeRequest = (value) => ({
    type: FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_REQUEST,
    payload: value
});

export const fetchAllowanceDataForInsertByTypeSuccess = (allowanceDataForInsertByType) => ({
    type: FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_SUCCESS,
    payload: allowanceDataForInsertByType,
});


export const fetchAllowanceDataForInsertByTypeFailure = (error) => ({
    type: FETCH_ALLOWANCE_DATA_FOR_INSERT_BY_TYPE_FAILURE,
    payload: error,
});
