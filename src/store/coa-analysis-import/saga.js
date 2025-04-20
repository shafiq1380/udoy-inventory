import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https";
import { coaAnalysisImportSuccess, coaAnalysisImportFailure, coaImportByIdDataSuccess, coaImportByIdDataFailure } from './actions';
import { COA_ANALYSIS_IMPORT, COA_IMPORT_BY_ID_DATA } from './actionType';

function* coaAnalysisImportFile() {
    // console.log("Data from saga reverse --------->>>>", data.payload);
    try {
        const coaAnalysisData = yield Post('/api/CoaSetup/CoaImportList')
        // console.log("coaAnalysisData ------->>>>", coaAnalysisData);

        if (coaAnalysisData.data.success === false) {
            yield put(coaAnalysisImportFailure(coaAnalysisData.data.errorMessage));
        } else {
            yield put(coaAnalysisImportSuccess(coaAnalysisData.data.data));
        }
    } catch (error) {
        console.log(error)
    }
};

function* coaAnalysisImportById(data) {
    // console.log("Data from saga coaAnalysisImportById --------->>>>", data.payload);
    const coaAnalysisImportById = yield Post('/api/CoaSetup/CoaImportByID', data.payload)
    // console.log("coaAnalysisImportById ------->>>>", coaAnalysisImportById);

    if (coaAnalysisImportById.data.success === false) {
        yield put(coaImportByIdDataFailure(coaAnalysisImportById.data.errorMessage));
    } else {
        yield put(coaImportByIdDataSuccess(coaAnalysisImportById.data.data));
    }
    try {

    } catch (error) {
        console.log(error)
    }

};

function* coaAnalysisImportSaga() {
    yield takeEvery(COA_ANALYSIS_IMPORT, coaAnalysisImportFile);
    yield takeEvery(COA_IMPORT_BY_ID_DATA, coaAnalysisImportById);
};

export default coaAnalysisImportSaga;