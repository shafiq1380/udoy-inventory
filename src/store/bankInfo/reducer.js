import {
    ADDED_BANKINFORMATION_FAIL,
    ADDED_BANKINFORMATION_SUCCESS,
    ADD_BANK_INFORMATION,
    DELETE_BANK_INFORMATION,
    GET_ALL_BANK_INFORMATION,
    GET_ALL_BANK_INFORMATION_SUCCESS,
    UPDATE_BANKINFORMATION
} from "./actionType";

const initialState = {
    loading: false,
    bankInfo: [],
    error: null,
    success: null,
    getLoading: false
}

const bankInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BANK_INFORMATION:
            return {
                ...state,
                loading: true,
            }

        case ADDED_BANKINFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload,
                error: null
            }

        case ADDED_BANKINFORMATION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: null
            }


        case GET_ALL_BANK_INFORMATION:
            return {
                ...state,
                getLoading: true,
                error: null
            }

        case GET_ALL_BANK_INFORMATION_SUCCESS:
            return {
                ...state,
                bankInfo: action.payload,
                getLoading: false
            }

        case UPDATE_BANKINFORMATION:
            return { ...state }

        case DELETE_BANK_INFORMATION:
            return {
                ...state,
            }

        default:
            return state
    }
}

export default bankInfoReducer