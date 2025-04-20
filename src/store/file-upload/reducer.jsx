import { FILE_UPLOAD_REQUEST, FILE_UPLOAD_SUCCESS, FILE_UPLOAD_FAIL } from './actionTypes.jsx'


const initialState = {
    fileUploadLoading: false,
    fileUploadError: null,
    fileUploadSuccess: null,
};

const fileUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILE_UPLOAD_REQUEST:
            return {
                ...state,
                fileUploadLoading: true,
            };
        case FILE_UPLOAD_SUCCESS:
            return {
                ...state,
                fileUploadLoading: false,
                fileUploadError: null,
                fileUploadSuccess: action.payload
            };
        case FILE_UPLOAD_FAIL:
            return {
                ...state,
                fileUploadLoading: false,
                fileUploadError: action.payload,
                fileUploadSuccess: null
            };
        default:
            return state;
    }
};


export default fileUploadReducer;