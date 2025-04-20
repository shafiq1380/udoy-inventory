import { COA_ANALYSIS_IMPORT, COA_ANALYSIS_IMPORT_SUCCESS, COA_ANALYSIS_IMPORT_FAILURE, COA_IMPORT_BY_ID_DATA, COA_IMPORT_BY_ID_DATA_SUCCESS, COA_IMPORT_BY_ID_DATA_FAILURE } from './actionType';


const initialState = {
    coaImportLoading: false,
    coaError: null,
    coaSuccess: null,

    coaImportByIdLoading: false,
    coaImportByIdError: null,
    coaImportByIdSuccess: null
};

const coaAnalysisImportReducer = (state = initialState, action) => {
    switch (action.type) {
        case COA_ANALYSIS_IMPORT:
            return {
                ...state,
                coaImportLoading: true
            };
        case COA_ANALYSIS_IMPORT_SUCCESS:
            return {
                ...state,
                coaImportLoading: false,
                coaSuccess: action.payload
            };
        case COA_ANALYSIS_IMPORT_FAILURE:
            return {
                ...state,
                coaImportLoading: false,
                coaError: action.payload
            };
        case COA_IMPORT_BY_ID_DATA:
            return {
                ...state,
                coaImportByIdLoading: true
            };
        case COA_IMPORT_BY_ID_DATA_SUCCESS:
            return {
                ...state,
                coaImportByIdLoading: false,
                coaImportByIdSuccess: action.payload
            };
        case COA_IMPORT_BY_ID_DATA_FAILURE:
            return {
                ...state,
                coaImportByIdLoading: false,
                coaImportByIdError: action.payload
            };
        default:
            return state;
    }
};

export default coaAnalysisImportReducer;