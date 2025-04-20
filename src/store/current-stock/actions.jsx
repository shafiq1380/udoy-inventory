export const GET_CURRENT_STOCK_REQUEST = "GET_CURRENT_STOCK_REQUEST";
export const GET_CURRENT_STOCK_SUCCESS = "GET_CURRENT_STOCK_SUCCESS";
export const GET_CURRENT_STOCK_FAILURE = "GET_CURRENT_STOCK_FAILURE";

export const POST_TRANSACTION = "POST_TRANSACTION"
export const DELETE_TRANSACTION = "DELETE_TRANSACTION"

export const TRANSACTION_SUCCESS = "TRANSACTION_SUCCESS"
export const TRANSACTION_FAILER = "TRANSACTION_FAILER"




export const getCurrentStockRequest = (value) => ({
    type: GET_CURRENT_STOCK_REQUEST,
    payload: value
});

export const getCurrentStockSuccess = (value) => ({
    type: GET_CURRENT_STOCK_SUCCESS,
    payload: value.data
});

export const getCurrentStockFailure = (value) => ({
    type: GET_CURRENT_STOCK_FAILURE,
    errorMessage: value
});


export const deleteTransaction = (value) => ({
    type: DELETE_TRANSACTION,
    payload: value
});
export const postTransaction = (value) => ({
    type: POST_TRANSACTION,
    payload: value
});


export const failedTransaction = (value) => ({
    type: TRANSACTION_FAILER,
    payload: value
});
export const successTransaction = (value) => ({
    type: TRANSACTION_SUCCESS,
    payload: value
});
