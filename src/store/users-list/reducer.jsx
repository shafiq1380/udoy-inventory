import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    UPDATE_USER,
    ADD_USER,
    ADDED_FAILER,
    ADDED_SUCCESS,
    ADDED_USERROLE,
    UPDATE_PASSWORD,
    USER_PHOTO_UPLOAD,
    UPDATE_USER_STATUS,
} from './actions';

const initialState = {
    loading: false,
    users: [],
    error: null,
    reload: false
};

const usersReducer = (state = initialState, action) => {
    // console.log("Reducer", action.payload);
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_USERS_SUCCESS:
            // console.log("Reducer success", action.payload);
            return {
                ...state,
                loading: false,
                users: action.payload,
            };
        case FETCH_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        //update user informaion   
        case UPDATE_USER:
            return {
                ...state,
                reload: !state.reload,
            };

        case ADD_USER:
            return state;

        case ADDED_FAILER:
            return {
                ...state,
                error: action.payload,
            };
        case ADDED_SUCCESS:
            return {
                ...state,
                reload: !state.reload,
                error: '',
                loading: false
            };

        case ADDED_USERROLE:
            return state;

        case UPDATE_PASSWORD:
            return state;

        case USER_PHOTO_UPLOAD:
            return {
                ...state,
                loading: true,
            }
        case UPDATE_USER_STATUS:
            return {
                ...state,
                loading: true,
            }
        default:
            return state;
    }
};

export default usersReducer;