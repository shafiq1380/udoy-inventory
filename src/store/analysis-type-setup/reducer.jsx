import {
    FETCH_ANAL_TYPE_REQUEST,
    FETCH_ANAL_TYPE_SUCCESS,
    FETCH_ANAL_TYPE_FAILURE,
    UPDATE_ANAL_TYPE,
    ADD_ANAL_TYPE,
    UPDATE_ANAL_TYPE_SUCCESS,
} from './actions';

const initialState = {
    loading: false,
    anals: [],
    error: null,
    reload: false,
};

const analtypeReducer = (state = initialState, action) => {
    // console.log("Reducer", action.payload);
    switch (action.type) {
        case FETCH_ANAL_TYPE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ANAL_TYPE_SUCCESS:
            // console.log("Reducer success", action.payload);
            return {
                ...state,
                loading: false,
                anals: action.payload,
                reload: false,
            };
        case FETCH_ANAL_TYPE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        //update anal informaion   
        case UPDATE_ANAL_TYPE:
            return state

        case UPDATE_ANAL_TYPE_SUCCESS:
            return {
                ...state,
                reload: !state.reload
            };

        case ADD_ANAL_TYPE:
            return {
                ...state
            }

        default:
            return state;
    }
};

export default analtypeReducer;