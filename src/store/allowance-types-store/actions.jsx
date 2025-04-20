export const FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST = 'FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST';
export const FETCH_ALLOWANCE_LISTS_BY_TYPE_SUCCESS = 'FETCH_ALLOWANCE_LISTS_BY_TYPE_SUCCESS';
export const FETCH_ALLOWANCE_LISTS_BY_TYPE_FAILURE = 'FETCH_ALLOWANCE_LISTS_BY_TYPE_FAILURE';

export const fetchAllowanceListsByTypeRequest = (value) => ({
    type: FETCH_ALLOWANCE_LISTS_BY_TYPE_REQUEST,
    payload: value,
});

export const fetchAllowanceListsByTypeSuccess = allowanceListsByType => ({
    type: FETCH_ALLOWANCE_LISTS_BY_TYPE_SUCCESS,
    payload: allowanceListsByType,
});

export const fetchAllowanceListsByTypeFailure = error => ({
    type: FETCH_ALLOWANCE_LISTS_BY_TYPE_FAILURE,
    payload: error,
});