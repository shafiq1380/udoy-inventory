export const FETCH_COA_SETUP_REQUEST = 'FETCH_COA_SETUP_REQUEST';
export const FETCH_COA_SETUP_SUCCESS = 'FETCH_COA_SETUP_SUCCESS';
export const FETCH_COA_SETUP_FAILURE = 'FETCH_COA_SETUP_FAILURE';

export const UPDATE_COA_CATEGORY = 'UPDATE_COA_CATEGORY';
export const UPDATE_COA_SETUP_SUCCESS = 'UPDATE_COA_SETUP_SUCCESS';


export const ADDED_COA_ACCOUNT = 'ADDED_COA_ACCOUNT';
export const ADDED_COA_CATEGORY = 'ADDED_COA_CATEGORY';
export const UPDATE_COA_ACCOUNT = 'UPDATE_COA_ACCOUNT';

export const FETCH_COA_ANALYSIS = 'FETCH_COA_ANALYSIS'
export const FETCH_COA_ANALYSIS_SUCCESS = 'FETCH_COA_ANALYSIS_SUCCESS'
// Get All COA Account Information

export const FETCH_COA_ACCOUNT_REQUEST = 'FETCH_COA_ACCOUNT_REQUEST';
export const FETCH_COA_ACCOUNT_SUCCESS = 'FETCH_COA_ACCOUNT_SUCCESS';
export const FETCH_COA_ACCOUNT_FAILURE = 'FETCH_COA_ACCOUNT_FAILURE';

// Get Voucher Type Setup

export const FETCH_VOUCHER_TYPE_REQUEST = 'FETCH_VOUCHER_TYPE_REQUEST';
export const FETCH_VOUCHER_TYPE_SUCCESS = 'FETCH_VOUCHER_TYPE_SUCCESS';
export const FETCH_VOUCHER_TYPE_FAILURE = 'FETCH_VOUCHER_TYPE_FAILURE';

// Get Enterprise Setup

export const FETCH_ENTERPRISE_SETUP_REQUEST = 'FETCH_ENTERPRISE_SETUP_REQUEST';
export const FETCH_ENTERPRISE_SETUP_SUCCESS = 'FETCH_ENTERPRISE_SETUP_SUCCESS';
export const FETCH_ENTERPRISE_SETUP_FAILURE = 'FETCH_ENTERPRISE_SETUP_FAILURE';

// Get Division Setup

export const FETCH_DIVISION_REQUEST = 'FETCH_DIVISION_REQUEST';
export const FETCH_DIVISION_SUCCESS = 'FETCH_DIVISION_SUCCESS';
export const FETCH_DIVISION_FAILURE = 'FETCH_DIVISION_FAILURE';

// Get Entity Setup

export const FETCH_ENTITY_REQUEST = 'FETCH_ENTITY_REQUEST';
export const FETCH_ENTITY_SUCCESS = 'FETCH_ENTITY_SUCCESS';
export const FETCH_ENTITY_FAILURE = 'FETCH_ENTITY_FAILURE';

// Get Business Unit Setup

export const FETCH_BUSINESS_UNIT_REQUEST = 'FETCH_BUSINESS_UNIT_REQUEST';
export const FETCH_BUSINESS_UNIT_SUCCESS = 'FETCH_BUSINESS_UNIT_SUCCESS';
export const FETCH_BUSINESS_UNIT_FAILURE = 'FETCH_BUSINESS_UNIT_FAILURE';


export const fetchCoaSetupRequest = (value) => ({
    type: FETCH_COA_SETUP_REQUEST,
    payload: value,
});

export const UpdateCoaCategory = (value) => ({
    type: UPDATE_COA_CATEGORY,
    payload: value,
});

export const fetchCoaSetupSuccess = coaSetup => ({
    type: FETCH_COA_SETUP_SUCCESS,
    payload: coaSetup,
});

export const fetchCoaSetupFailure = error => ({
    type: FETCH_COA_SETUP_FAILURE,
    payload: error,
});


export const UpdateCoaSetupSucess = (value) => ({
    type: UPDATE_COA_SETUP_SUCCESS,
    payload: value
});

export const addCoaAccount = (value) => ({
    type: ADDED_COA_ACCOUNT,
    payload: value,
});
export const updateCoaAccount = (value) => ({
    type: UPDATE_COA_ACCOUNT,
    payload: value,
});


export const addCoaCategory = (value) => ({
    type: ADDED_COA_CATEGORY,
    payload: value,
});


export const fetchCoaAnalysis = (value) => ({
    type: FETCH_COA_ANALYSIS,
});

export const fetchCoaAnalysisSucess = (value) => ({
    type: FETCH_COA_ANALYSIS_SUCCESS,
    payload: value,
});
// Get All COA Account Information

export const fetchAllCoaAccount = (value) => ({
    type: FETCH_COA_ACCOUNT_REQUEST,
    payload: value,
});

export const fetchAllCoaAccountSuccess = coaAccount => ({
    type: FETCH_COA_ACCOUNT_SUCCESS,
    payload: coaAccount,
});

export const fetchAllCoaAccountFailure = error => ({
    type: FETCH_COA_ACCOUNT_FAILURE,
    payload: error,
});

// Get Voucher Type Setup

export const fetchVoucherTypeRequest = (value) => ({
    type: FETCH_VOUCHER_TYPE_REQUEST,
    payload: value,
});

export const fetchVoucherTypeSuccess = voucherType => ({
    type: FETCH_VOUCHER_TYPE_SUCCESS,
    payload: voucherType,
});

export const fetchVoucherTypeFailure = error => ({
    type: FETCH_VOUCHER_TYPE_FAILURE,
    payload: error,
});

// Get Enterprise Setup

export const fetchEnterpriseSetupRequest = (value) => ({
    type: FETCH_ENTERPRISE_SETUP_REQUEST,
    payload: value,
});

export const fetchEnterpriseSetupSuccess = enterpriseSetup => ({
    type: FETCH_ENTERPRISE_SETUP_SUCCESS,
    payload: enterpriseSetup,
});

export const fetchEnterpriseSetupFailure = error => ({
    type: FETCH_ENTERPRISE_SETUP_FAILURE,
    payload: error,
});

// Get Division Setup

export const fetchDivisionRequest = (value) => ({
    type: FETCH_DIVISION_REQUEST,
    payload: value,
});

export const fetchDivisionSuccess = divisionSetup => ({
    type: FETCH_DIVISION_SUCCESS,
    payload: divisionSetup,
});

export const fetchDivisionFailure = error => ({
    type: FETCH_DIVISION_FAILURE,
    payload: error,
});

// Get Entity Setup

export const fetchEntityRequest = (value) => ({
    type: FETCH_ENTITY_REQUEST,
    payload: value,
});

export const fetchEntitySuccess = entitySetup => ({
    type: FETCH_ENTITY_SUCCESS,
    payload: entitySetup,
});

export const fetchEntityFailure = error => ({
    type: FETCH_ENTITY_FAILURE,
    payload: error,
});

// Get Business Unit Setup

export const fetchBusinessUnitRequest = (value) => ({
    type: FETCH_BUSINESS_UNIT_REQUEST,
    payload: value,
});

export const fetchBusinessUnitSuccess = businessUnitSetup => ({
    type: FETCH_BUSINESS_UNIT_SUCCESS,
    payload: businessUnitSetup,
});

export const fetchBusinessUnitFailure = error => ({
    type: FETCH_BUSINESS_UNIT_FAILURE,
    payload: error,
});