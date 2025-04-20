export const FETCH_PF_DETAILS_BY_ID_REQUEST = 'FETCH_PF_DETAILS_BY_ID_REQUEST';
export const FETCH_PF_DETAILS_BY_ID_SUCCESS = 'FETCH_PF_DETAILS_BY_ID_SUCCESS';
export const FETCH_PF_DETAILS_BY_ID_FAILURE = 'FETCH_PF_DETAILS_BY_ID_FAILURE';

export const PF_DATA_FOR_UPDATE_BY_ID_REQUEST = 'PF_DATA_FOR_UPDATE_BY_ID_REQUEST';
export const PF_DATA_FOR_UPDATE_BY_ID_SUCCESS = 'PF_DATA_FOR_UPDATE_BY_ID_SUCCESS';
export const PF_DATA_FOR_UPDATE_BY_ID_FAILURE = 'PF_DATA_FOR_UPDATE_BY_ID_FAILURE';

export const fetchPFDetailsByIdRequest = (value) => ({
    type: FETCH_PF_DETAILS_BY_ID_REQUEST,
    payload: value,
});

export const fetchPFDetailsByIdSuccess = pfDetailsById => ({
    type: FETCH_PF_DETAILS_BY_ID_SUCCESS,
    payload: pfDetailsById,
});

export const fetchPFDetailsByIdFailure = error => ({
    type: FETCH_PF_DETAILS_BY_ID_FAILURE,
    payload: error,
});

export const pfDataForUpdateByIdRequest = (value) => ({
    type: PF_DATA_FOR_UPDATE_BY_ID_REQUEST,
    payload: value,
});

export const pfDataForUpdateByIdSuccess = pfDetailsById => ({
    type: PF_DATA_FOR_UPDATE_BY_ID_SUCCESS,
    payload: pfDetailsById,
});

export const pfDataForUpdateByIdFailure = error => ({
    type: PF_DATA_FOR_UPDATE_BY_ID_FAILURE,
    payload: error,
});