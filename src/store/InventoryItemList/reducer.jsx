import { FETCH_ALLGROUP_SUCCESS, FETCH_ALLITEMLSIT, FETCH_ALLITEMLSIT_SUCCESS, FETCH_ALLITMGROUP, FETCH_ALLITM_SUBGROUP, FETCH_CATEGORY, FETCH_CATEGORY_SUCCESS, FETCH_SUBGROUP_SUCCESS, FETCH_UOM, FETCH_UOM_SUCCESS } from './actions';

const initialState = {
    loading: false,
    itemGroupList: [],
    itemSubGroupList: [],
    itemCategoryList: [],
    allItemUom: [],
    allItemList: [],
    error: null,
    reload: false
};

const AllItemList = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALLITEMLSIT:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_ALLITEMLSIT_SUCCESS:
            return {
                ...state,
                loading: false,
                allItemList: action.payload,
            };

        case FETCH_ALLITMGROUP:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_ALLGROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                itemGroupList: action.payload,
            };

        case FETCH_ALLITM_SUBGROUP:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_SUBGROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                itemSubGroupList: action.payload,
            };

        case FETCH_CATEGORY:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                itemCategoryList: action.payload,
            };

        case FETCH_UOM:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_UOM_SUCCESS:
            return {
                ...state,
                loading: false,
                allItemUom: action.payload,
            };

        default:
            return state;
    }
};

export default AllItemList;