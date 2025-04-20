export const FETCH_ALLITEMLSIT = 'FETCH_ALLITEMLSIT';
export const FETCH_ALLITEMLSIT_SUCCESS = 'FETCH_ALLITEMLSIT_SUCCESS';

export const FETCH_ALLITMGROUP = 'FETCH_ALLITMGROUP';
export const FETCH_ALLGROUP_SUCCESS = 'FETCH_ALLGROUP_SUCCESS';

export const FETCH_ALLITM_SUBGROUP = 'FETCH_ALLITM_SUBGROUP';
export const FETCH_SUBGROUP_SUCCESS = 'FETCH_SUBGROUP_SUCCESS';

export const FETCH_CATEGORY = 'FETCH_CATEGORY';
export const FETCH_CATEGORY_SUCCESS = 'FETCH_CATEGORY_SUCCESS';

export const FETCH_UOMID = 'FETCH_UOMID';
export const FETCH_UOMID_SUCCESS = 'FETCH_UOMID_SUCCESS';

export const FETCH_UOM = 'FETCH_UOM';
export const FETCH_UOM_SUCCESS = 'FETCH_UOM_SUCCESS';




export const fetchAllItemList = (value) => ({
    type: FETCH_ALLITEMLSIT,
    payload: value,
});

export const fetchAllItemListSuccess = (value) => ({
    type: FETCH_ALLITEMLSIT_SUCCESS,
    payload: value,
});


export const fetchAllGroup = (value) => ({
    type: FETCH_ALLITMGROUP,
    payload: value,
});

export const fetchAllGroupSuccess = (value) => ({
    type: FETCH_ALLGROUP_SUCCESS,
    payload: value,
});

export const fetchSubGroup = (value) => ({
    type: FETCH_ALLITM_SUBGROUP,
    payload: value,
});

export const fetchSubGroupSuccess = (value) => ({
    type: FETCH_SUBGROUP_SUCCESS,
    payload: value,
});


export const fetchCategory = (value) => ({
    type: FETCH_CATEGORY,
    payload: value,
});

export const fetchCategorySuccess = (value) => ({
    type: FETCH_CATEGORY_SUCCESS,
    payload: value,
});

// uom id
export const fetchUomId = (value) => ({
    type: FETCH_UOMID,
    payload: value,
});

export const fetchUomIdSuccess = (value) => ({
    type: FETCH_UOMID_SUCCESS,
    payload: value,
});

export const fetchUom = (value) => ({
    type: FETCH_UOM,
    payload: value,
});

export const fetchUomSuccess = (value) => ({
    type: FETCH_UOM_SUCCESS,
    payload: value,
});
