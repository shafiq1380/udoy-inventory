import { put, takeLatest } from 'redux-saga/effects';
import {
    FETCH_COA_SETUP_REQUEST,
    fetchCoaSetupSuccess,
    fetchCoaSetupFailure,
    UpdateCoaSetupSucess,
    ADDED_COA_ACCOUNT,
    ADDED_COA_CATEGORY,
    UPDATE_COA_ACCOUNT,
    UPDATE_COA_CATEGORY,
    FETCH_COA_ANALYSIS,
    fetchCoaAnalysisSucess,

    // Get All COA Account Information
    FETCH_COA_ACCOUNT_REQUEST,
    fetchAllCoaAccountSuccess,
    fetchAllCoaAccountFailure,

    // Get Voucher Type Setup
    FETCH_VOUCHER_TYPE_REQUEST,
    fetchVoucherTypeSuccess,
    fetchVoucherTypeFailure,

    // Get Enterprise Setup
    FETCH_ENTERPRISE_SETUP_REQUEST,
    fetchEnterpriseSetupSuccess,
    fetchEnterpriseSetupFailure,

    // Get Division Setup
    FETCH_DIVISION_REQUEST,
    fetchDivisionSuccess,
    fetchDivisionFailure,

    // Get Entity Setup
    FETCH_ENTITY_REQUEST,
    fetchEntitySuccess,
    fetchEntityFailure,

    // Get Business Unit Setup
    FETCH_BUSINESS_UNIT_REQUEST,
    fetchBusinessUnitSuccess,
    fetchBusinessUnitFailure

} from './actions';

import { Post } from '../../utils/https';

function* fetchCoaSetupSaga(search) {
    // console.log("search ------->>>>>> ", search);
    const data = { data: "" || search.payload }
    // console.log('search Data ', data)
    try {
        const response = yield Post('/api/v1/CoaSetup/GetAllCoa', data)
        // console.log("response  ---------->>>>>>> ", response.data.data);
        yield put(fetchCoaSetupSuccess(response.data.data));
    } catch (error) {
        yield put(fetchCoaSetupFailure(error))
    }
};


function* addCoaAccount(newData) {
    // console.log('Added COA account', newData.payload)
    try {
        const response = yield Post('/api/v1/CoaSetup/AddCoaAccount', newData.payload)
        if (response.data.success === true) {
            yield put(UpdateCoaSetupSucess('Update Success'));
        } else if (response.data.success === false) {
            yield put(fetchCoaSetupFailure(response.data.errorMessage))
        }
        // yield put(fetchCoaSetupSuccess(response.data.data));
    } catch (error) {
        // yield put(fetchCoaSetupFailure(error))
    }
};

function* updateCoaAccount(newData) {
    // console.log('coa account', newData)
    try {
        const response = yield Post('/api/v1/CoaSetup/UpdateCoaAccount', newData.payload)
        if (response.data.success === true) {
            yield put(UpdateCoaSetupSucess('Update Success'));
        } else if (response.data.success === false) {
            yield put(fetchCoaSetupFailure(response.data.errorMessage))
        }
        // yield put(fetchCoaSetupSuccess(response.data.data));
    } catch (error) {
        // yield put(fetchCoaSetupFailure(error))
    }
};



function* addCoaCategory(newData) {
    try {
        const response = yield Post('/api/v1/CoaSetup/AddCoaCategory', newData.payload)
        if (response.data.success === true) {
            yield put(UpdateCoaSetupSucess('Added Success'));
        } else if (response.data.success === false) {
            yield put(fetchCoaSetupFailure(response.data.errorMessage))
        }
        // yield put(fetchCoaSetupSuccess(response.data.data));
    } catch (error) {
        // yield put(fetchCoaSetupFailure(error))
    }
};


function* UpdateCoaCategory(newData) {
    try {
        const response = yield Post('/api/v1/CoaSetup/UpdateCoaCategory', newData.payload)
        if (response.data.success === true) {
            yield put(UpdateCoaSetupSucess('Update Success'));
        } else if (response.data.success === false) {
            yield put(fetchCoaSetupFailure(response.data.errorMessage))
        }
    } catch (error) {
        // yield put(fetchCoaSetupFailure(error))
    }
};

function* fetchCoaAnalysis() {
    // console.log('called Analysis')
    try {
        const response = yield Post('/api/v1/CoaSetup/GetAllAnalysisType')
        // console.log('Analysis', response)
        yield put(fetchCoaAnalysisSucess(response.data.data));
    } catch (error) {
        yield put(fetchCoaSetupFailure(error))
        // Get All COA Account Information
    }
}
function* fetchAllCoaInformation() {
    try {
        const response = yield Post('/api/v1/CoaSetup/GetAllCoaAccountWithAnalysis')
        // console.log("response from saga file ---------->>>>>>> ", response.data.data);
        yield put(fetchAllCoaAccountSuccess(response.data.data));
    } catch (error) {
        yield put(fetchAllCoaAccountFailure(error))
    }
};

// Get Voucher Type Setup

function* fetchVoucherType() {
    try {
        const response = yield Post('/api/v1/VoucherEntry/GetVoucherType')
        // console.log("response from saga file ---------->>>>>>> ", response.data.data);
        yield put(fetchVoucherTypeSuccess(response.data.data));
    } catch (error) {
        yield put(fetchVoucherTypeFailure(error))
    }
};

// Get Enterprise Setup

function* fetchEnterpriseSetup() {
    try {
        const response = yield Post('/api/v1/Organization/GetEnterpriseSetup')
        // console.log("response from saga file ---------->>>>>>> ", response.data.data);
        yield put(fetchEnterpriseSetupSuccess(response.data.data));
    } catch (error) {
        yield put(fetchEnterpriseSetupFailure(error))
    }
};

// Get Division Setup

function* fetchDivisionSetup() {
    try {
        const response = yield Post('/api/v1/Organization/GetDivisionSetup')
        // console.log("response from saga file ---------->>>>>>> ", response.data.data);
        yield put(fetchDivisionSuccess(response.data.data));
    } catch (error) {
        yield put(fetchDivisionFailure(error))
    }
};

// Get Entity Setup

function* fetchEntitySetup() {
    try {
        const response = yield Post('/api/v1/Organization/GetEntitySetup')
        // console.log("response from saga file ---------->>>>>>> ", response.data.data);
        yield put(fetchEntitySuccess(response.data.data));
    } catch (error) {
        yield put(fetchEntityFailure(error))
    }
};

// Get Business Unit Setup

function* fetchBusinessUnitSetup() {
    try {
        const response = yield Post('/api/v1/Organization/GetBusinessUnitSetup')
        // console.log("response from saga file ---------->>>>>>> ", response.data.data);
        yield put(fetchBusinessUnitSuccess(response.data.data));
    } catch (error) {
        yield put(fetchBusinessUnitFailure(error))
    }
};

function* coaSetupSaga() {
    yield takeLatest(FETCH_COA_SETUP_REQUEST, fetchCoaSetupSaga);
    yield takeLatest(UPDATE_COA_CATEGORY, UpdateCoaCategory);
    yield takeLatest(ADDED_COA_CATEGORY, addCoaCategory);
    yield takeLatest(ADDED_COA_ACCOUNT, addCoaAccount);
    yield takeLatest(UPDATE_COA_ACCOUNT, updateCoaAccount);
    yield takeLatest(FETCH_COA_ANALYSIS, fetchCoaAnalysis);
    yield takeLatest(FETCH_COA_ACCOUNT_REQUEST, fetchAllCoaInformation);
    yield takeLatest(FETCH_VOUCHER_TYPE_REQUEST, fetchVoucherType);
    yield takeLatest(FETCH_ENTERPRISE_SETUP_REQUEST, fetchEnterpriseSetup);
    yield takeLatest(FETCH_DIVISION_REQUEST, fetchDivisionSetup);
    yield takeLatest(FETCH_ENTITY_REQUEST, fetchEntitySetup);
    yield takeLatest(FETCH_BUSINESS_UNIT_REQUEST, fetchBusinessUnitSetup);
};

export default coaSetupSaga