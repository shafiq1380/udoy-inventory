export const GET_PF_TRANSACTION_REQUEST = 'GET_PF_TRANSACTION_REQUEST';
export const GET_PF_TRANSACTION_SUCCESS = 'GET_PF_TRANSACTION_SUCCESS';
export const GET_PF_TRANSACTION_FAILED = 'GET_PF_TRANSACTION_FAILED';

export const getPFTransactionByTypeRequest = (value) => ({
    type: GET_PF_TRANSACTION_REQUEST,
    payload: value,
});

export const getPFTransactionByTypeSuccess = allowanceListsByType => ({
    type: GET_PF_TRANSACTION_SUCCESS,
    payload: allowanceListsByType,
});

export const getPFTransactionByTypeFailure = error => ({
    type: GET_PF_TRANSACTION_FAILED,
    payload: error,
});