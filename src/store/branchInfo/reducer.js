import { ADDED_BRANCHINFORMATION_FAIL, ADDED_BRANCHINFORMATION_SUCCESS, ADD_BRANCH_INFORMATION, GET_ALL_BRANCH_INFORMATIION_SUCCESS, GET_BRANCH_INFORMATION, UPDATE_BRANCHINFORMATION } from "./actionType";

const initialState = {
    loading: false,
    branchInfo: [],
    error: null,
    success: null,
}

const branchInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BRANCH_INFORMATION:
            return {
                ...state,
                loading: true,
            }
        case GET_BRANCH_INFORMATION:
            return {
                ...state,
                loading: false,
                error: null
            }
        case GET_ALL_BRANCH_INFORMATIION_SUCCESS:
            return {
                ...state,
                branchInfo: action.payload
            }

        case ADDED_BRANCHINFORMATION_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload,
                error: null
            }
        case ADDED_BRANCHINFORMATION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: null
            }

        case UPDATE_BRANCHINFORMATION:
            return { ...state }

        default:
            return state
    }
}

export default branchInfoReducer