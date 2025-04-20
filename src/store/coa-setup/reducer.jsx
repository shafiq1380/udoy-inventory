import {
    FETCH_COA_SETUP_REQUEST,
    FETCH_COA_SETUP_SUCCESS,
    FETCH_COA_SETUP_FAILURE,
    UPDATE_COA_SETUP_SUCCESS,
    ADDED_COA_ACCOUNT,
    ADDED_COA_CATEGORY,
    UPDATE_COA_ACCOUNT,
    UPDATE_COA_CATEGORY,
    FETCH_COA_ANALYSIS,
    FETCH_COA_ANALYSIS_SUCCESS,

    // Get All COA Account Information
    FETCH_COA_ACCOUNT_REQUEST,
    FETCH_COA_ACCOUNT_SUCCESS,
    FETCH_COA_ACCOUNT_FAILURE,

    // Get Voucher Type Setup
    FETCH_VOUCHER_TYPE_REQUEST,
    FETCH_VOUCHER_TYPE_SUCCESS,
    FETCH_VOUCHER_TYPE_FAILURE,

    // Get Enterprise Setup
    FETCH_ENTERPRISE_SETUP_REQUEST,
    FETCH_ENTERPRISE_SETUP_SUCCESS,
    FETCH_ENTERPRISE_SETUP_FAILURE,

    // Get Division Setup
    FETCH_DIVISION_REQUEST,
    FETCH_DIVISION_SUCCESS,
    FETCH_DIVISION_FAILURE,

    // Get Entity Setup
    FETCH_ENTITY_REQUEST,
    FETCH_ENTITY_SUCCESS,
    FETCH_ENTITY_FAILURE,

    // Get Business Unit Setup
    FETCH_BUSINESS_UNIT_REQUEST,
    FETCH_BUSINESS_UNIT_SUCCESS,
    FETCH_BUSINESS_UNIT_FAILURE,
} from "./actions";

const initialState = {
    loading: false,
    coaSetup: [],
    error: null,
    dataUpdateLoading: false,
    reloadPage: false,
    success: null,
    coaAnalysis: [],
    allCoaAccounts: [],
    allVoucherType: [],
    allEnterpriseSetup: [],
    allDivision: [],
    allEntity: [],
    allBusinessUnit: [],
};

const coaSetupReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COA_SETUP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_COA_SETUP_SUCCESS:
            return {
                ...state,
                loading: false,
                coaSetup: action.payload,
            };
        case FETCH_COA_SETUP_FAILURE:
            return {
                ...state,
                loading: false,
                dataUpdateLoading: false,
                error: action.payload,
            };

        case UPDATE_COA_CATEGORY:
            return {
                ...state,
                dataUpdateLoading: true
            }

        case UPDATE_COA_SETUP_SUCCESS:
            return {
                ...state,
                dataUpdateLoading: false,
                reloadPage: !state.reloadPage,
                success: action.payload
            }

        case ADDED_COA_ACCOUNT:
            return {
                ...state,
                dataUpdateLoading: true
            }
        case ADDED_COA_CATEGORY:
            return {
                ...state,
                dataUpdateLoading: true
            }
        case UPDATE_COA_ACCOUNT:
            return {
                ...state,
                dataUpdateLoading: true
            }
        case FETCH_COA_ANALYSIS:
            return {
                ...state,
                loading: true
            }
        case FETCH_COA_ANALYSIS_SUCCESS:
            return {
                ...state,
                coaAnalysis: action.payload,
                loading: false
            }

        // Get All COA Account Information

        case FETCH_COA_ACCOUNT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_COA_ACCOUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                allCoaAccounts: action.payload,
            };
        case FETCH_COA_ACCOUNT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Voucher Type Setup

        case FETCH_VOUCHER_TYPE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_VOUCHER_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                allVoucherType: action.payload,
            };
        case FETCH_VOUCHER_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Enterprise Setup

        case FETCH_ENTERPRISE_SETUP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ENTERPRISE_SETUP_SUCCESS:
            return {
                ...state,
                loading: false,
                allEnterpriseSetup: action.payload,
            };
        case FETCH_ENTERPRISE_SETUP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Division Setup

        case FETCH_DIVISION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_DIVISION_SUCCESS:
            return {
                ...state,
                loading: false,
                allDivision: action.payload,
            };
        case FETCH_DIVISION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Entity Setup

        case FETCH_ENTITY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ENTITY_SUCCESS:
            return {
                ...state,
                loading: false,
                allEntity: action.payload,
            };
        case FETCH_ENTITY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Business Unit Setup

        case FETCH_BUSINESS_UNIT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_BUSINESS_UNIT_SUCCESS:
            return {
                ...state,
                loading: false,
                allBusinessUnit: action.payload,
            };
        case FETCH_BUSINESS_UNIT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default coaSetupReducer;