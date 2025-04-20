import { COA_ANALYSIS_IMPORT, COA_ANALYSIS_IMPORT_SUCCESS, COA_ANALYSIS_IMPORT_FAILURE, COA_IMPORT_BY_ID_DATA, COA_IMPORT_BY_ID_DATA_SUCCESS, COA_IMPORT_BY_ID_DATA_FAILURE } from './actionType';

export const coaAnalysisImport = () => {
    return {
        type: COA_ANALYSIS_IMPORT,
    }
};

export const coaAnalysisImportSuccess = (response) => {
    return {
        type: COA_ANALYSIS_IMPORT_SUCCESS,
        payload: response
    }
};

export const coaAnalysisImportFailure = (error) => {
    return {
        type: COA_ANALYSIS_IMPORT_FAILURE,
        payload: error
    }
};

export const coaImportByIdData = (id) => {
    return {
        type: COA_IMPORT_BY_ID_DATA,
        payload: id
    }
};

export const coaImportByIdDataSuccess = (response) => {
    return {
        type: COA_IMPORT_BY_ID_DATA_SUCCESS,
        payload: response
    }
};

export const coaImportByIdDataFailure = (error) => {
    return {
        type: COA_IMPORT_BY_ID_DATA_FAILURE,
        payload: error
    }
};